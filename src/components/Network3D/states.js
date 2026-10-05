/**
 * Narrative states of the network, one per section (see STATE_ORDER).
 *
 * Every node has fixed logical coordinates (u, v) on a grid; each state is just a
 * different mapping of that grid into 3D space. Because edges always link grid
 * neighbours, connections stay short and coherent while the network reorganises.
 *
 * Wide and compact screens tell exactly the same story with the same shapes; the
 * compact parameters only resize and recentre each shape so it fits a portrait screen.
 *
 * `travel` moves the camera while the user scrolls through that section. It is
 * accumulated into the following states, so the journey stays continuous.
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

const band = ({ center, width, height, wave, depth }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * 0.3,
  center[1] + (node.v - 0.5) * height + Math.sin(node.u * TAU * 1.5) * wave + node.jitter[1] * 0.25,
  center[2] + node.jitter[2] * depth,
]

// Columns run down the tunnel; rows wrap around it.
const tunnel = ({ radius, length, start }) => (node) => {
  const angle = node.vWrap * TAU + node.u * 0.8
  const r = radius * (0.85 + 0.3 * node.seed)
  return [Math.cos(angle) * r, Math.sin(angle) * r, start - node.u * length]
}

const scatter = ({ center, width, height, depth }) => (node) => [
  center[0] + (node.u - 0.5) * width + node.jitter[0] * width * 0.06,
  center[1] + (node.v - 0.5) * height + node.jitter[1] * height * 0.08,
  center[2] + node.jitter[2] * depth,
]

const defaults = {
  travel: [0, 0, 0],
  sway: 0,
  /** 0 freezes drift, sway, parallax and fades the data packets out. */
  motion: 1,
  opacity: 1,
  flowBias: 0,
  riskWeight: 0,
  /** On compact screens, pull the camera back until the whole shape fits the width. */
  contain: false,
  /**
   * Locks the shape to its section (or to a visible `[data-network-anchor]` inside it,
   * which also sets its size): it scrolls in with it and leaves with it.
   */
  anchor: false,
  camera: { position: [0, 0, 15], target: [0, 0, 0] },
}

const STATES = {
  hero: {
    shape: sphere,
    sway: 1,
    contain: true,
    wide: { center: [4.4, 0.1, 0], radius: 4.3, scale: [1.2, 1, 1], noise: 0.5, variance: 0.3 },
    compact: { center: [0, 2.6, -1], radius: 2, scale: [1, 1.05, 1], noise: 0.25, variance: 0.3 },
  },
  benefits: {
    // Entering the infrastructure: the same cloud, expanded around the viewer.
    shape: sphere,
    sway: 0.4,
    opacity: 0.6,
    wide: { center: [0, 0, -2], radius: 9.5, scale: [1.3, 1, 1], noise: 1.4, variance: 0.45 },
    compact: { center: [0, 0, -2], radius: 6, scale: [0.8, 1.4, 1], noise: 0.8, variance: 0.45 },
  },
  services: {
    // Organised topology: the network settles into a structured floor plan.
    shape: plane,
    opacity: 0.7,
    camera: { position: [0, 3.5, 14], target: [0, -2.2, -3] },
    wide: { center: [0, -3.4, -4], width: 26, depth: 16, noise: 0.25 },
    compact: { center: [0, -3.2, -4], width: 11, depth: 16, noise: 0.15 },
  },
  segments: {
    shape: band,
    flowBias: 1,
    opacity: 0.85,
    wide: { center: [0, -0.6, -1], width: 34, height: 3, wave: 0.8, depth: 2.5 },
    compact: { center: [0, -0.5, -1], width: 14, height: 3, wave: 0.5, depth: 1.5 },
  },
  experience: {
    // Data flowing through the structure: the camera travels down a tunnel.
    shape: tunnel,
    center: [0, 0, -17],
    camera: { position: [0, 0, 13], target: [0, 0, 0] },
    travel: [0, 0, -18],
    flowBias: 1,
    opacity: 0.85,
    wide: { radius: 4.8, length: 46, start: 6 },
    compact: { radius: 2.5, length: 40, start: 6 },
  },
  diagnostic: {
    // Loose structure where the critical points light up one by one.
    shape: scatter,
    sway: 0.2,
    riskWeight: 1,
    opacity: 0.7,
    wide: { center: [0, 0, -2], width: 28, height: 15, depth: 6 },
    compact: { center: [0, 0, -2], width: 7, height: 16, depth: 4 },
  },
  cta: {
    // Stable, converged globe: beside the text on wide screens, above it on compact ones.
    shape: sphere,
    motion: 0,
    contain: true,
    anchor: true,
    wide: { center: [4.4, 0, -1], radius: 3.2, noise: 0.06, variance: 0.05 },
    compact: { center: [0, 0, -1], radius: 2.1, noise: 0.05, variance: 0.05 },
  },
}

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]

/** Resolves the states in narrative order, applying the accumulated camera travel. */
export function getStates(order, isCompact) {
  let offset = [0, 0, 0]

  return order.map((name) => {
    const { shape, wide, compact, ...common } = STATES[name]
    const params = isCompact ? compact : wide
    const state = { ...defaults, ...common }
    const resolved = {
      ...state,
      name,
      offset,
      layout: shape(params),
      center: add(params.center ?? state.center, offset),
      camera: {
        position: add(state.camera.position, offset),
        target: add(state.camera.target, offset),
      },
    }
    offset = add(offset, state.travel)
    return resolved
  })
}
