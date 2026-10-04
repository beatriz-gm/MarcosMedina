/**
 * Narrative states of the network, one per section (see STATE_ORDER).
 *
 * Every node has fixed logical coordinates (u, v) on a grid; each state is just a
 * different mapping of that grid into 3D space. Because edges always link grid
 * neighbours, connections stay short and coherent while the network reorganises.
 *
 * `travel` moves the camera while the user scrolls through that section. It is
 * accumulated into the following states, so the journey is continuous (on narrow
 * screens the camera keeps descending through the infrastructure).
 */

const TAU = Math.PI * 2

const sphere = ({ center, radius, scale = [1, 1, 1], noise, variance }) => (node) => {
  const theta = node.uWrap * TAU + node.v * 0.6
  const phi = Math.PI * (0.14 + node.v * 0.72)
  const r = radius * (1 - variance + variance * node.seed)
  return [
    center[0] + r * Math.sin(phi) * Math.cos(theta) * scale[0] + node.jitter[0] * noise,
    center[1] + r * Math.cos(phi) * scale[1] + node.jitter[1] * noise,
    center[2] + r * Math.sin(phi) * Math.sin(theta) * scale[2] + node.jitter[2] * noise,
  ]
}

const plane = ({ center, width, depth, noise }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * noise,
  center[1] + node.jitter[1] * noise * 0.4,
  center[2] + (node.v - 0.5) * depth + node.jitter[2] * noise,
]

const column = ({ center, width, height, depth, noise }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * noise,
  center[1] - (node.v - 0.5) * height + node.jitter[1] * noise,
  center[2] + node.jitter[2] * depth,
]

const band = ({ center, width, height, wave, depth }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * 0.3,
  center[1] + (node.v - 0.5) * height + Math.sin(node.u * TAU * 1.5) * wave + node.jitter[1] * 0.25,
  center[2] + node.jitter[2] * depth,
]

// `along` picks which grid axis runs down the tunnel; the other one wraps around it.
const tunnel = ({ radius, length, start, along }) => (node) => {
  const depth = along === 'u' ? node.u : node.v
  const around = along === 'u' ? node.vWrap : node.uWrap
  const angle = around * TAU + depth * 0.8
  const r = radius * (0.85 + 0.3 * node.seed)
  return [Math.cos(angle) * r, Math.sin(angle) * r, start - depth * length]
}

const scatter = ({ center, width, height, depth }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * width * 0.06,
  center[1] + (node.v - 0.5) * height + node.jitter[1] * height * 0.08,
  center[2] + node.jitter[2] * depth,
]

const defaults = {
  travel: [0, 0, 0],
  sway: 0,
  opacity: 1,
  flowBias: 0,
  riskWeight: 0,
  camera: { position: [0, 0, 15], target: [0, 0, 0] },
}

// Wide screens: the network explores width, depth and perspective.
const wideStates = {
  hero: {
    layout: sphere({ center: [4.4, 0.1, 0], radius: 4.3, scale: [1.2, 1, 1], noise: 0.5, variance: 0.3 }),
    center: [4.4, 0.1, 0],
    sway: 1,
  },
  benefits: {
    // Entering the infrastructure: the same cloud, expanded around the viewer.
    layout: sphere({ center: [0, 0, -2], radius: 9.5, scale: [1.3, 1, 1], noise: 1.4, variance: 0.45 }),
    center: [0, 0, -2],
    sway: 0.4,
    opacity: 0.6,
  },
  services: {
    // Organised topology: the network settles into a structured floor plan.
    layout: plane({ center: [0, -3.4, -4], width: 26, depth: 16, noise: 0.25 }),
    center: [0, -3.4, -4],
    camera: { position: [0, 3.5, 14], target: [0, -2.2, -3] },
    opacity: 0.7,
  },
  segments: {
    layout: band({ center: [0, -0.6, -1], width: 34, height: 3, wave: 0.8, depth: 2.5 }),
    center: [0, -0.6, -1],
    flowBias: 1,
    opacity: 0.85,
  },
  experience: {
    // Data flowing through the structure: the camera travels down a tunnel.
    layout: tunnel({ radius: 4.8, length: 46, start: 6, along: 'u' }),
    center: [0, 0, -17],
    camera: { position: [0, 0, 13], target: [0, 0, 0] },
    travel: [0, 0, -18],
    flowBias: 1,
    opacity: 0.85,
  },
  diagnostic: {
    // Loose structure where the critical points light up one by one.
    layout: scatter({ center: [0, 0, -2], width: 28, height: 15, depth: 6 }),
    center: [0, 0, -2],
    sway: 0.2,
    riskWeight: 1,
    opacity: 0.7,
  },
  cta: {
    // Stable, converged network.
    layout: sphere({ center: [4.6, 0, 0], radius: 3, noise: 0.06, variance: 0.05 }),
    center: [4.6, 0, 0],
    sway: 1,
  },
}

// Narrow screens: a vertical journey through the same infrastructure.
const verticalStates = {
  hero: {
    layout: sphere({ center: [0, 2.3, -2], radius: 3.2, scale: [1, 1.15, 1], noise: 0.4, variance: 0.3 }),
    center: [0, 2.3, -2],
    sway: 1,
  },
  benefits: {
    layout: column({ center: [0, -7, -1], width: 6, height: 26, depth: 3, noise: 0.5 }),
    center: [0, -7, -1],
    travel: [0, -14, 0],
    opacity: 0.6,
  },
  services: {
    layout: column({ center: [0, -9, -1], width: 4.4, height: 30, depth: 1.2, noise: 0.15 }),
    center: [0, -9, -1],
    camera: { position: [0, 0, 14], target: [0, 0, 0] },
    travel: [0, -16, 0],
    opacity: 0.7,
  },
  segments: {
    layout: band({ center: [0, -0.5, -1], width: 11, height: 4.5, wave: 0.6, depth: 2 }),
    center: [0, -0.5, -1],
    flowBias: 1,
    opacity: 0.85,
  },
  experience: {
    layout: tunnel({ radius: 3, length: 40, start: 6, along: 'v' }),
    center: [0, 0, -14],
    camera: { position: [0, 0, 13], target: [0, 0, 0] },
    travel: [0, 0, -16],
    flowBias: 1,
    opacity: 0.85,
  },
  diagnostic: {
    layout: column({ center: [0, -5, -2], width: 7, height: 22, depth: 4, noise: 0.8 }),
    center: [0, -5, -2],
    travel: [0, -12, 0],
    riskWeight: 1,
    opacity: 0.7,
  },
  cta: {
    layout: sphere({ center: [0, 3.2, -1], radius: 1.8, noise: 0.05, variance: 0.05 }),
    center: [0, 3.2, -1],
    sway: 1,
    opacity: 0.8,
  },
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/** Resolves the states in narrative order, applying the accumulated camera travel. */
export function getStates(order, isVertical) {
  const source = isVertical ? verticalStates : wideStates
  let offset = [0, 0, 0]

  return order.map((name) => {
    const state = { ...defaults, ...source[name] }
    const resolved = {
      ...state,
      name,
      offset,
      center: add(state.center, offset),
      camera: {
        position: add(state.camera.position, offset),
        target: add(state.camera.target, offset),
      },
    }
    offset = add(offset, state.travel)
    return resolved
  })
}
