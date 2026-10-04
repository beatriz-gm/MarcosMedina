import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils } from 'three'
import { warningSigns } from '../../data/diagnostic'
import { CameraRig } from './CameraRig'
import { Connections } from './Connections'
import { DataParticles } from './DataParticles'
import { createNetworkModel } from './graph'
import { networkStore } from './networkStore'
import { Nodes } from './Nodes'
import { createSharedUniforms, MAX_BANDS } from './shaders'

// Low power (phones): same scene, fewer packets, no antialias, capped pixel ratio and 30 fps.
const QUALITY = {
  high: { dpr: [1, 1.75], antialias: true, packets: 64, trail: 3, nodeSize: 190, packetSize: 150, fps: 0 },
  low: { dpr: [1, 1.35], antialias: false, packets: 24, trail: 2, nodeSize: 175, packetSize: 140, fps: 30 },
}

// Share of a transition used to stagger nodes, so the network reorganises organically.
const STAGGER = 0.35
const DRIFT = 0.1
const PROGRESS_DAMPING = 3.5
const POINTER_DAMPING = 3
// Average frame time above which the pixel ratio is dropped to 1 (relative to the target rate).
const SLOW_FRAME = 1 / 40
const SLOW_FRAME_TOLERANCE = 1.3
const PERF_SAMPLE = { skip: 30, frames: 90 }
// The static (reduced motion) network stays behind every section, so it is kept subtle.
const STATIC_OPACITY = 0.5

const smoothstep = (t) => t * t * (3 - 2 * t)
const clamp01 = (t) => Math.min(1, Math.max(0, t))

/** Requests frames at a fixed rate when the canvas runs with frameloop="demand". */
function FrameLimiter({ fps }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    const interval = 1000 / fps
    let last = 0
    let id = requestAnimationFrame(function tick(now) {
      id = requestAnimationFrame(tick)
      if (now - last < interval - 1) return
      last = now
      invalidate()
    })
    return () => cancelAnimationFrame(id)
  }, [fps, invalidate])

  return null
}

function NetworkScene({ isCompact, quality, reduceMotion, parallax }) {
  const { gl, size, setDpr, invalidate } = useThree()
  const model = useMemo(() => createNetworkModel({ isCompact, riskCount: warningSigns.length }), [isCompact])
  const uniforms = useMemo(createSharedUniforms, [])
  const frame = useMemo(
    () => ({ progress: 0, from: 0, to: 0, ease: 0, motion: 1, local: [], pointer: { x: 0, y: 0 } }),
    [],
  )
  const perf = useRef({ frames: 0, time: 0, done: false })

  // Without continuous animation the scene only needs a new frame when the page scrolls.
  useEffect(() => {
    if (!reduceMotion) return undefined
    window.addEventListener('scroll', invalidate, { passive: true })
    return () => window.removeEventListener('scroll', invalidate)
  }, [reduceMotion, invalidate])

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const time = state.clock.elapsedTime
    const { states, layouts, nodes, positions, dynamics } = model
    const last = states.length - 1

    // Narrative position (reduced motion keeps the hero composition, fixed).
    if (!reduceMotion) {
      frame.progress = MathUtils.damp(frame.progress, networkStore.progress, PROGRESS_DAMPING, delta)
      states.forEach((_, i) => {
        frame.local[i] = MathUtils.damp(frame.local[i] ?? 0, networkStore.local[i] ?? 0, PROGRESS_DAMPING, delta)
      })
      frame.pointer.x = MathUtils.damp(frame.pointer.x, networkStore.pointer.x, POINTER_DAMPING, delta)
      frame.pointer.y = MathUtils.damp(frame.pointer.y, networkStore.pointer.y, POINTER_DAMPING, delta)
    }
    frame.from = Math.min(Math.floor(frame.progress), last)
    frame.to = Math.min(frame.from + 1, last)
    const fraction = frame.progress - frame.from
    frame.ease = smoothstep(clamp01(fraction))

    const a = states[frame.from]
    const b = states[frame.to]
    const blend = (key) => a[key] + (b[key] - a[key]) * frame.ease

    uniforms.uTime.value = time
    uniforms.uPixelRatio.value = gl.getPixelRatio()
    uniforms.uOpacity.value = reduceMotion ? STATIC_OPACITY : blend('opacity')
    uniforms.uRiskWeight.value = blend('riskWeight')
    uniforms.uRiskLevel.value = MathUtils.damp(uniforms.uRiskLevel.value, networkStore.riskLevel, 6, delta)

    // Still states (the closing CTA) freeze drift, sway and parallax and fade the packets.
    frame.motion = reduceMotion ? 0 : blend('motion')
    uniforms.uFlowOpacity.value = frame.motion

    networkStore.velocity *= Math.exp(-delta * 3)
    dynamics.flowBias = blend('flowBias')
    dynamics.flowSpeed = 1 + networkStore.velocity * 4

    // Node positions: staggered morph between the two states, ambient drift, then a
    // gentle sway around the state's centre.
    const sway = reduceMotion ? 0 : blend('sway')
    const yaw = sway * (Math.sin(time * 0.08) * 0.35 + frame.pointer.x * 0.25)
    const pitch = sway * frame.pointer.y * 0.12
    const cosYaw = Math.cos(yaw)
    const sinYaw = Math.sin(yaw)
    const cosPitch = Math.cos(pitch)
    const sinPitch = Math.sin(pitch)
    const cx = a.center[0] + (b.center[0] - a.center[0]) * frame.ease
    const cy = a.center[1] + (b.center[1] - a.center[1]) * frame.ease
    const cz = a.center[2] + (b.center[2] - a.center[2]) * frame.ease
    const from = layouts[frame.from]
    const to = layouts[frame.to]
    const drift = DRIFT * frame.motion

    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i]
      const i3 = i * 3
      const t = smoothstep(clamp01((fraction - node.delay * STAGGER) / (1 - STAGGER)))
      const wave = time * node.speed + node.phase

      const dx = from[i3] + (to[i3] - from[i3]) * t + Math.sin(wave) * drift - cx
      const dy = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * t + Math.cos(wave * 0.8) * drift - cy
      const dz = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * t + Math.sin(wave * 0.6) * drift - cz

      const rx = dx * cosYaw + dz * sinYaw
      const rz = -dx * sinYaw + dz * cosYaw
      positions[i3] = cx + rx
      positions[i3 + 1] = cy + dy * cosPitch - rz * sinPitch
      positions[i3 + 2] = cz + dy * sinPitch + rz * cosPitch
    }

    // Blue sections currently on screen, converted to bottom-up device pixels.
    const scrollY = window.scrollY
    const pixelRatio = gl.getPixelRatio()
    let bandCount = 0
    for (const [top, bottom] of networkStore.primaryBands) {
      const screenTop = top - scrollY
      const screenBottom = bottom - scrollY
      if (screenBottom < 0 || screenTop > size.height || bandCount === MAX_BANDS) continue
      uniforms.uBands.value[bandCount].set((size.height - screenBottom) * pixelRatio, (size.height - screenTop) * pixelRatio)
      bandCount += 1
    }
    uniforms.uBandCount.value = bandCount

    // One-off check: drop the pixel ratio on devices that struggle.
    const sample = perf.current
    if (!sample.done && !reduceMotion) {
      sample.frames += 1
      if (sample.frames > PERF_SAMPLE.skip) sample.time += rawDelta
      if (sample.frames === PERF_SAMPLE.skip + PERF_SAMPLE.frames) {
        sample.done = true
        const budget = quality.fps ? SLOW_FRAME_TOLERANCE / quality.fps : SLOW_FRAME
        if (sample.time / PERF_SAMPLE.frames > budget) setDpr(1)
      }
    }
  }, -2)

  return (
    <>
      <CameraRig states={model.states} frame={frame} isCompact={isCompact} parallax={parallax} />
      <Connections model={model} uniforms={uniforms} />
      <Nodes model={model} uniforms={uniforms} sizeScale={quality.nodeSize} />
      {!reduceMotion && (
        <DataParticles
          model={model}
          uniforms={uniforms}
          packetCount={quality.packets}
          trailLength={quality.trail}
          sizeScale={quality.packetSize}
        />
      )}
    </>
  )
}

export default function Network3D({ isCompact, isLowPower, reduceMotion, onReady }) {
  const quality = isLowPower ? QUALITY.low : QUALITY.high
  const parallax = !isLowPower && !reduceMotion

  useEffect(() => {
    if (!parallax) return undefined
    const onPointerMove = (event) => {
      networkStore.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      networkStore.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [parallax])

  return (
    <Canvas
      dpr={quality.dpr}
      gl={{ antialias: quality.antialias, alpha: true, powerPreference: isLowPower ? 'low-power' : 'high-performance' }}
      camera={{ fov: 40, near: 0.1, far: 120, position: [0, 0, 15] }}
      frameloop={reduceMotion || quality.fps ? 'demand' : 'always'}
      onCreated={onReady}
    >
      {!reduceMotion && quality.fps > 0 && <FrameLimiter fps={quality.fps} />}
      <NetworkScene isCompact={isCompact} quality={quality} reduceMotion={reduceMotion} parallax={parallax} />
    </Canvas>
  )
}
