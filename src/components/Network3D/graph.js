import { getStates } from './states'
import { STATE_ORDER } from './networkStore'

// Compact screens use the same shapes with fewer nodes, to keep mobile GPUs and CPUs light.
const GRID = {
  wide: { columns: 14, rows: 9 },
  compact: { columns: 11, rows: 7 },
}

// Share of grid links kept, and chance of an extra diagonal, so the mesh reads as organic.
const EDGE_KEEP_CHANCE = 0.72
const DIAGONAL_CHANCE = 0.12

/** Small deterministic PRNG so the network looks the same on every visit. */
function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Builds the graph once: nodes on a logical grid, neighbour edges, adjacency for the
 * data packets, and the precomputed position of every node in every narrative state.
 */
export function createNetworkModel({ isCompact, riskCount }) {
  const { columns, rows } = isCompact ? GRID.compact : GRID.wide
  const random = createRandom(isCompact ? 7 : 11)
  const signed = () => random() * 2 - 1

  const nodes = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      nodes.push({
        col,
        row,
        u: col / (columns - 1),
        v: row / (rows - 1),
        uWrap: col / columns,
        vWrap: row / rows,
        jitter: [signed(), signed(), signed()],
        seed: random(),
        delay: random(),
        phase: random() * Math.PI * 2,
        speed: 0.4 + random() * 0.6,
      })
    }
  }

  const count = nodes.length
  const indexOf = (col, row) => row * columns + col
  const edgeList = []
  const degree = new Uint8Array(count)
  const link = (a, b) => {
    edgeList.push(a, b)
    degree[a] += 1
    degree[b] += 1
  }

  nodes.forEach((node, index) => {
    if (node.col < columns - 1 && random() < EDGE_KEEP_CHANCE) link(index, indexOf(node.col + 1, node.row))
    if (node.row < rows - 1 && random() < EDGE_KEEP_CHANCE) link(index, indexOf(node.col, node.row + 1))
    if (node.col < columns - 1 && node.row < rows - 1 && random() < DIAGONAL_CHANCE) {
      link(index, indexOf(node.col + 1, node.row + 1))
    }
  })

  // No isolated nodes: packets must always be able to leave a node.
  nodes.forEach((node, index) => {
    if (degree[index] > 0) return
    const neighbour = node.col < columns - 1 ? indexOf(node.col + 1, node.row) : indexOf(node.col - 1, node.row)
    link(index, neighbour)
  })

  const edges = Uint16Array.from(edgeList)
  const adjacency = nodes.map(() => [])
  for (let e = 0; e < edges.length / 2; e += 1) {
    adjacency[edges[e * 2]].push(edges[e * 2 + 1])
    adjacency[edges[e * 2 + 1]].push(edges[e * 2])
  }

  // Better-connected nodes read as hubs and are drawn larger.
  const sizes = Float32Array.from(nodes, (node, index) => 0.65 + node.seed * 0.45 + degree[index] * 0.08)

  // Risk nodes are spread evenly through the grid; rank n lights up with warning sign n.
  const risk = new Float32Array(count)
  for (let rank = 1; rank <= riskCount; rank += 1) {
    risk[Math.floor(((rank - 0.5) / riskCount) * count)] = rank
  }

  const states = getStates(STATE_ORDER, isCompact)
  const layouts = states.map((state) => {
    const positions = new Float32Array(count * 3)
    // Horizontal reach of the shape around its centre, used by the camera to contain it.
    state.halfWidth = 0
    nodes.forEach((node, index) => {
      const [x, y, z] = state.layout(node)
      positions[index * 3] = x + state.offset[0]
      positions[index * 3 + 1] = y + state.offset[1]
      positions[index * 3 + 2] = z + state.offset[2]
      state.halfWidth = Math.max(state.halfWidth, Math.abs(x + state.offset[0] - state.center[0]))
    })
    return positions
  })

  return {
    count,
    nodes,
    edges,
    adjacency,
    sizes,
    risk,
    states,
    layouts,
    /** Live positions, rewritten every frame by the scene and read by every layer. */
    positions: Float32Array.from(layouts[0]),
    /** Live scalar parameters blended between states. */
    dynamics: { flowBias: 0, flowSpeed: 1 },
  }
}
