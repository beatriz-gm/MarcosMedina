import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, DynamicDrawUsage, ShaderMaterial } from 'three'
import { depthFadeChunk, themeChunk } from './shaders'

// Gap (in edge fraction) between the head of a packet and each trailing point.
const TRAIL_SPACING = 0.07
// How strongly a positive `flowBias` steers packets towards increasing grid coordinates.
const FLOW_STEERING = 12

const vertexShader = /* glsl */ `
  attribute float aTrail;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  varying float vAlpha;
  ${depthFadeChunk}

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depth = -mvPosition.z;
    float head = 1.0 - aTrail;
    gl_PointSize = min((0.45 + 0.55 * head) * uSizeScale * uPixelRatio / depth, 24.0 * uPixelRatio);
    vAlpha = depthFade(depth) * (0.25 + 0.75 * head);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uAlphaOnLight;
  uniform float uAlphaOnPrimary;
  varying float vAlpha;
  ${themeChunk}

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float shape = 1.0 - smoothstep(0.2, 0.5, d);

    float primary = onPrimary();
    vec3 color = mix(uColorOnLight, uColorOnPrimary, primary);
    float alpha = mix(uAlphaOnLight, uAlphaOnPrimary, primary);
    gl_FragColor = vec4(color, shape * alpha * vAlpha * uOpacity);
  }
`

/** Small packets walking the graph edge by edge, like data moving through the network. */
export function DataParticles({ model, uniforms, packetCount, trailLength, sizeScale }) {
  const packets = useMemo(() => {
    let seed = 1
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    return Array.from({ length: packetCount }, () => {
      const from = Math.floor(random() * model.count)
      const neighbours = model.adjacency[from]
      return {
        from,
        to: neighbours[Math.floor(random() * neighbours.length)],
        progress: random(),
        speed: 0.35 + random() * 0.45,
      }
    })
  }, [model, packetCount])

  const geometry = useMemo(() => {
    const total = packetCount * trailLength
    const result = new BufferGeometry()
    result.setAttribute('position', new BufferAttribute(new Float32Array(total * 3), 3).setUsage(DynamicDrawUsage))
    result.setAttribute(
      'aTrail',
      new BufferAttribute(
        Float32Array.from({ length: total }, (_, i) => (i % trailLength) / trailLength),
        1,
      ),
    )
    return result
  }, [packetCount, trailLength])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          ...uniforms,
          uSizeScale: { value: sizeScale },
          uAlphaOnLight: { value: 0.9 },
          uAlphaOnPrimary: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms, sizeScale],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    const { adjacency, nodes, positions, dynamics } = model
    const target = geometry.attributes.position.array

    const nextNode = (current, previous) => {
      const options = adjacency[current].filter((n) => n !== previous)
      if (options.length === 0) return previous

      const forward = nodes[current].u + nodes[current].v
      const weights = options.map(
        (n) => 1 + dynamics.flowBias * Math.max(0, nodes[n].u + nodes[n].v - forward) * FLOW_STEERING,
      )
      let pick = Math.random() * weights.reduce((sum, w) => sum + w, 0)
      for (let i = 0; i < options.length; i += 1) {
        pick -= weights[i]
        if (pick <= 0) return options[i]
      }
      return options[options.length - 1]
    }

    packets.forEach((packet, p) => {
      packet.progress += delta * packet.speed * dynamics.flowSpeed
      while (packet.progress >= 1) {
        packet.progress -= 1
        const previous = packet.from
        packet.from = packet.to
        packet.to = nextNode(packet.from, previous)
      }

      const a = packet.from * 3
      const b = packet.to * 3
      for (let k = 0; k < trailLength; k += 1) {
        const t = Math.max(0, packet.progress - k * TRAIL_SPACING)
        const out = (p * trailLength + k) * 3
        target[out] = positions[a] + (positions[b] - positions[a]) * t
        target[out + 1] = positions[a + 1] + (positions[b + 1] - positions[a + 1]) * t
        target[out + 2] = positions[a + 2] + (positions[b + 2] - positions[a + 2]) * t
      }
    })

    geometry.attributes.position.needsUpdate = true
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
