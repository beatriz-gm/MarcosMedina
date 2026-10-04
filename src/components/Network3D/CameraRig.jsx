import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { networkStore } from './networkStore'

// Wide layouts are composed for 16:9; narrower desktop windows pull the camera back to fit.
const WIDE_REFERENCE_ASPECT = 16 / 9
const FIT_EXPONENT = 0.75
// Breathing room kept between a contained shape and the screen edges (1 = touching).
const CONTAIN_MARGIN = 1.15
const PARALLAX = { x: 0.7, y: 0.45 }
// How quickly an anchored shape catches up with its section. Reading the scroll position
// straight into the camera makes the shape shake, so it follows a damped value instead.
const ANCHOR_DAMPING = 12

/**
 * Moves the camera between the per-state viewpoints. While a state is active its
 * `travel` is applied using the section's own scroll progress (e.g. flying through
 * the tunnel). Anchored states follow their anchor element (or section) smoothly,
 * scrolling in and out with it, and can be sized to that element's width. Pointer parallax is desktop-only and fades out in still states.
 */
export function CameraRig({ states, frame, isCompact, parallax }) {
  const vectors = useMemo(
    () => ({
      from: { position: new Vector3(), target: new Vector3() },
      to: { position: new Vector3(), target: new Vector3() },
      offset: new Vector3(),
      position: new Vector3(),
      target: new Vector3(),
    }),
    [],
  )
  const anchor = useMemo(() => ({ offset: null }), [])

  useFrame(({ camera, size }, delta) => {
    const aspect = size.width / size.height
    const tanHalfFov = Math.tan(MathUtils.degToRad(camera.fov / 2))

    // Smoothed distance (px) between the anchor's centre and the screen centre.
    const anchorIndex = [frame.from, frame.to].find((index) => states[index].anchor)
    const anchorTarget = networkStore.anchors[anchorIndex]
    if (anchorTarget) {
      const offset = anchorTarget.center - window.scrollY - size.height / 2
      anchor.offset = anchor.offset === null ? offset : MathUtils.damp(anchor.offset, offset, ANCHOR_DAMPING, delta)
    } else {
      anchor.offset = null
    }

    // Viewpoint of one state, written into `out`.
    const resolve = (index, out) => {
      const state = states[index]
      vectors.offset.fromArray(state.travel).multiplyScalar(frame.local[index] ?? 0)
      out.position.fromArray(state.camera.position).add(vectors.offset)
      out.target.fromArray(state.camera.target).add(vectors.offset)

      // Scale factor (applied to the camera–target distance) that puts the shape at `depth`.
      const fitForDepth = (depth) =>
        (depth - (out.target.z - state.center[2])) / (out.position.z - out.target.z)
      const anchorWidth = state.anchor ? networkStore.anchors[index]?.width : null

      let fit = Math.max(1, WIDE_REFERENCE_ASPECT / aspect) ** FIT_EXPONENT
      if (anchorWidth) {
        // Depth at which the shape's width matches the anchor element's width.
        fit = fitForDepth((state.halfWidth * size.height) / (anchorWidth * tanHalfFov))
      } else if (isCompact) {
        const required = (state.halfWidth * CONTAIN_MARGIN) / (tanHalfFov * aspect)
        fit = state.contain ? Math.max(1, fitForDepth(required)) : 1
      }
      out.position.sub(out.target).multiplyScalar(fit).add(out.target)

      if (state.anchor && anchor.offset !== null) {
        // Screen offset converted to world units at the shape's depth.
        // Raising the camera lowers the shape on screen.
        const depth = out.position.z - state.center[2]
        const pan = (anchor.offset * 2 * depth * tanHalfFov) / size.height
        out.position.y += pan
        out.target.y += pan
      }
    }

    resolve(frame.from, vectors.from)
    resolve(frame.to, vectors.to)

    const { position, target } = vectors
    position.lerpVectors(vectors.from.position, vectors.to.position, frame.ease)
    target.lerpVectors(vectors.from.target, vectors.to.target, frame.ease)

    if (parallax) {
      position.x += frame.pointer.x * PARALLAX.x * frame.motion
      position.y += frame.pointer.y * PARALLAX.y * frame.motion
    }

    camera.position.copy(position)
    camera.lookAt(target)
  }, -1)

  return null
}
