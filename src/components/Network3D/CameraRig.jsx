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

/**
 * Moves the camera between the per-state viewpoints. While a state is active its
 * `travel` is applied using the section's own scroll progress (e.g. flying through
 * the tunnel). Anchored states stay locked to the centre of their section, scrolling
 * in and out with it. Pointer parallax is desktop-only and fades out in still states.
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

  useFrame(({ camera, size }) => {
    const aspect = size.width / size.height
    const tanHalfFov = Math.tan(MathUtils.degToRad(camera.fov / 2))

    // Viewpoint of one state, written into `out`.
    const resolve = (index, out) => {
      const state = states[index]
      vectors.offset.fromArray(state.travel).multiplyScalar(frame.local[index] ?? 0)
      out.position.fromArray(state.camera.position).add(vectors.offset)
      out.target.fromArray(state.camera.target).add(vectors.offset)

      let fit = Math.max(1, WIDE_REFERENCE_ASPECT / aspect) ** FIT_EXPONENT
      if (isCompact) {
        fit = 1
        if (state.contain) {
          const depth = out.position.z - state.center[2]
          const required = (state.halfWidth * CONTAIN_MARGIN) / (tanHalfFov * aspect)
          fit = Math.max(1, required / depth)
        }
      }
      out.position.sub(out.target).multiplyScalar(fit).add(out.target)

      const sectionCenter = networkStore.sectionCenters[index]
      if (state.anchor && sectionCenter != null) {
        // Pixels between the section centre and the screen centre, converted to world
        // units at the shape's depth. Raising the camera lowers the shape.
        const offset = sectionCenter - window.scrollY - size.height / 2
        const depth = out.position.z - state.center[2]
        const pan = (offset * 2 * depth * tanHalfFov) / size.height
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
