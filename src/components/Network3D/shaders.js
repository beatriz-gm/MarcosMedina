import { Vector2, Vector3 } from 'three'

export const MAX_BANDS = 4

// Raw sRGB values on purpose: the shaders write them straight to the canvas,
// so the brand blue renders exactly as #2b73b8.
const hexToVector = (hex) => {
  const value = parseInt(hex.slice(1), 16)
  return new Vector3(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
}

/**
 * Uniforms shared by every network material. Materials spread this object into their
 * own uniforms, so they reference the same `{ value }` holders and a single update
 * per frame reaches all of them.
 */
export function createSharedUniforms() {
  return {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uOpacity: { value: 1 },
    uBands: { value: Array.from({ length: MAX_BANDS }, () => new Vector2(-1, -1)) },
    uBandCount: { value: 0 },
    uColorOnLight: { value: hexToVector('#2b73b8') },
    uColorOnPrimary: { value: hexToVector('#ffffff') },
    uRiskLevel: { value: 0 },
    uRiskWeight: { value: 0 },
  }
}

/**
 * The canvas is fixed behind the whole page. Blue sections are passed in as
 * screen-space bands; anything drawn over them turns white, everything else stays
 * brand blue. A node crossing a section edge changes colour exactly at the edge.
 */
export const themeChunk = /* glsl */ `
  uniform vec2 uBands[${MAX_BANDS}];
  uniform int uBandCount;
  uniform vec3 uColorOnLight;
  uniform vec3 uColorOnPrimary;
  uniform float uOpacity;

  float onPrimary() {
    float y = gl_FragCoord.y;
    for (int i = 0; i < ${MAX_BANDS}; i++) {
      if (i >= uBandCount) break;
      if (y >= uBands[i].x && y <= uBands[i].y) return 1.0;
    }
    return 0.0;
  }
`

// Fades geometry that gets too close to the camera or recedes into the distance.
export const depthFadeChunk = /* glsl */ `
  float depthFade(float depth) {
    return smoothstep(1.5, 4.0, depth) * (1.0 - smoothstep(18.0, 42.0, depth) * 0.8);
  }
`
