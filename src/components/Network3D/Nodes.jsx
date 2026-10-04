import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferAttribute, BufferGeometry, DynamicDrawUsage, ShaderMaterial } from 'three'
import { depthFadeChunk, themeChunk } from './shaders'

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aRisk;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform float uTime;
  uniform float uRiskLevel;
  uniform float uRiskWeight;
  varying float vFade;
  varying float vRisk;
  ${depthFadeChunk}

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depth = -mvPosition.z;

    // Risk nodes "switch on" as the matching warning sign is revealed.
    float isActiveRisk = step(0.5, aRisk) * step(aRisk, uRiskLevel + 0.5);
    vRisk = isActiveRisk * uRiskWeight;
    float pulse = 1.0 + vRisk * (1.3 + 0.25 * sin(uTime * 2.6 + aRisk));

    gl_PointSize = min(aSize * pulse * uSizeScale * uPixelRatio / depth, 44.0 * uPixelRatio);
    vFade = depthFade(depth);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uAlphaOnLight;
  uniform float uAlphaOnPrimary;
  varying float vFade;
  varying float vRisk;
  ${themeChunk}

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;

    // Solid core + soft halo; active risk nodes become a "target" (smaller core + ring).
    float coreRadius = mix(0.3, 0.16, vRisk);
    float core = 1.0 - smoothstep(coreRadius - 0.05, coreRadius, d);
    float halo = (1.0 - smoothstep(coreRadius, 0.5, d)) * 0.22;
    float ring = vRisk * (smoothstep(0.32, 0.36, d) - smoothstep(0.42, 0.46, d));
    float shape = max(max(core, halo), ring);

    float primary = onPrimary();
    vec3 color = mix(uColorOnLight, uColorOnPrimary, primary);
    float alpha = mix(uAlphaOnLight, uAlphaOnPrimary, primary);
    gl_FragColor = vec4(color, shape * alpha * vFade * uOpacity);
  }
`

export function Nodes({ model, uniforms, sizeScale }) {
  const geometry = useMemo(() => {
    const result = new BufferGeometry()
    result.setAttribute('position', new BufferAttribute(model.positions, 3).setUsage(DynamicDrawUsage))
    result.setAttribute('aSize', new BufferAttribute(model.sizes, 1))
    result.setAttribute('aRisk', new BufferAttribute(model.risk, 1))
    return result
  }, [model])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          ...uniforms,
          uSizeScale: { value: sizeScale },
          uAlphaOnLight: { value: 0.5 },
          uAlphaOnPrimary: { value: 0.9 },
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

  useFrame(() => {
    geometry.attributes.position.needsUpdate = true
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
