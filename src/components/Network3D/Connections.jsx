import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, DynamicDrawUsage, ShaderMaterial } from 'three'
import { depthFadeChunk, themeChunk } from './shaders'

const vertexShader = /* glsl */ `
  varying float vFade;
  ${depthFadeChunk}

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vFade = depthFade(-mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uAlphaOnLight;
  uniform float uAlphaOnPrimary;
  varying float vFade;
  ${themeChunk}

  void main() {
    float primary = onPrimary();
    vec3 color = mix(uColorOnLight, uColorOnPrimary, primary);
    float alpha = mix(uAlphaOnLight, uAlphaOnPrimary, primary);
    gl_FragColor = vec4(color, alpha * vFade * uOpacity);
  }
`

export function Connections({ model, uniforms }) {
  const edgeCount = model.edges.length / 2

  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    const positions = new Float32Array(edgeCount * 2 * 3)
    result.setAttribute('position', new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage))
    return result
  }, [edgeCount])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          ...uniforms,
          uAlphaOnLight: { value: 0.15 },
          uAlphaOnPrimary: { value: 0.26 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame(() => {
    const attribute = geometry.attributes.position
    const target = attribute.array
    const { edges, positions } = model

    for (let i = 0; i < edges.length; i += 1) {
      const node = edges[i] * 3
      target[i * 3] = positions[node]
      target[i * 3 + 1] = positions[node + 1]
      target[i * 3 + 2] = positions[node + 2]
    }
    attribute.needsUpdate = true
  })

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />
}
