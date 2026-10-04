/**
 * Mutable state shared between the DOM (scroll, sections) and the WebGL scene.
 * It is intentionally not React state: the scene reads it every frame, and writing
 * to it never triggers a re-render.
 */
export const networkStore = {
  /** Float position along STATE_ORDER, e.g. 2.4 = 40% of the way from state 2 to 3. */
  progress: 0,
  /** Progress (0–1) inside each state's own section, used for camera travel. */
  local: [],
  /** Document-space [top, bottom] ranges of blue sections, used to recolour the network. */
  primaryBands: [],
  /** Normalised scroll speed (0 = still), boosts the data flow. */
  velocity: 0,
  /** Number of diagnostic warning signs revealed so far. */
  riskLevel: 0,
  /** Pointer position in -1…1 (desktop parallax). */
  pointer: { x: 0, y: 0 },
}

// Section order drives the network narrative. Sections opt in with `data-network-state`.
export const STATE_ORDER = ['hero', 'benefits', 'services', 'segments', 'experience', 'diagnostic', 'cta']
