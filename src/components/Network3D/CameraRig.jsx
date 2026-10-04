import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

// Layouts are composed for these aspect ratios; other screens pull the camera back to fit.
const WIDE_REFERENCE_ASPECT = 16 / 9
const VERTICAL_REFERENCE_ASPECT = 9 / 19
const FIT_EXPONENT = 0.75
const PARALLAX = { x: 0.7, y: 0.45 }

/**
 * Moves the camera between the per-state viewpoints. While a state is active its
 * `travel` is applied using the section's own scroll progress (e.g. flying through
 * the tunnel or descending on mobile). Pointer parallax is desktop-only.
 */
export function CameraRig({ states, frame, isVertical, parallax }) {
  const vectors = useMemo(
    () => ({
      fromPosition: new Vector3(),
      toPosition: new Vector3(),
      fromTarget: new Vector3(),
      toTarget: new Vector3(),
      travel: new Vector3(),
      position: new Vector3(),
      target: new Vector3(),
    }),
    [],
  )

  useFrame(({ camera, size }) => {
    const { fromPosition, toPosition, fromTarget, toTarget, travel, position, target } = vectors
    const from = states[frame.from]
    const to = states[frame.to]

    travel.fromArray(from.travel).multiplyScalar(frame.local[frame.from] ?? 0)
    fromPosition.fromArray(from.camera.position).add(travel)
    fromTarget.fromArray(from.camera.target).add(travel)

    travel.fromArray(to.travel).multiplyScalar(frame.local[frame.to] ?? 0)
    toPosition.fromArray(to.camera.position).add(travel)
    toTarget.fromArray(to.camera.target).add(travel)

    position.lerpVectors(fromPosition, toPosition, frame.ease)
    target.lerpVectors(fromTarget, toTarget, frame.ease)

    const aspect = size.width / size.height
    const reference = isVertical ? VERTICAL_REFERENCE_ASPECT : WIDE_REFERENCE_ASPECT
    const fit = Math.max(1, reference / aspect) ** FIT_EXPONENT
    position.sub(target).multiplyScalar(fit).add(target)

    if (parallax) {
      position.x += frame.pointer.x * PARALLAX.x
      position.y += frame.pointer.y * PARALLAX.y
    }

    camera.position.copy(position)
    camera.lookAt(target)
  }, -1)

  return null
}
