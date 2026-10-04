import { useEffect } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { networkStore, STATE_ORDER } from './networkStore'

// A transition into section N runs while its top edge travels between these viewport ratios.
const TRANSITION_START = 0.85
const TRANSITION_END = 0.35
// Scroll speed (px/s) treated as "maximum" for the data-flow boost.
const MAX_VELOCITY = 4000

const clamp01 = (value) => Math.min(1, Math.max(0, value))

/**
 * Translates the scroll position into the network's narrative progress.
 * Section offsets are cached on every ScrollTrigger refresh (resize, load, fonts),
 * so the scroll handler itself never reads layout.
 */
export function useNetworkScroll() {
  useEffect(() => {
    let sectionTops = []

    const measure = () => {
      const scrollY = window.scrollY
      sectionTops = STATE_ORDER.map((name) => {
        const el = document.querySelector(`[data-network-state="${name}"]`)
        return el ? el.getBoundingClientRect().top + scrollY : null
      })
      networkStore.primaryBands = [...document.querySelectorAll('.theme-primary')].map((el) => {
        const rect = el.getBoundingClientRect()
        return [rect.top + scrollY, rect.bottom + scrollY]
      })
    }

    const update = (scrollY, velocity = 0) => {
      const vh = window.innerHeight
      const maxScroll = document.documentElement.scrollHeight - vh

      // Scroll range (px) during which the network morphs into each section's state.
      const windows = sectionTops.map((top) =>
        top === null ? null : [top - vh * TRANSITION_START, top - vh * TRANSITION_END],
      )

      networkStore.progress = windows.reduce((sum, range, index) => {
        if (index === 0 || !range) return sum
        return sum + clamp01((scrollY - range[0]) / (range[1] - range[0]))
      }, 0)

      networkStore.local = windows.map((range, index) => {
        const start = index === 0 ? 0 : (range?.[1] ?? 0)
        const next = windows.slice(index + 1).find(Boolean)
        const end = next ? next[0] : maxScroll
        return end > start ? clamp01((scrollY - start) / (end - start)) : 0
      })

      // The scene decays this value every frame; scrolling only ever pushes it up.
      networkStore.velocity = Math.max(networkStore.velocity, Math.min(Math.abs(velocity) / MAX_VELOCITY, 1))
    }

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => update(self.scroll(), self.getVelocity()),
      onRefresh: (self) => {
        measure()
        update(self.scroll())
      },
    })

    measure()
    update(window.scrollY)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => trigger.kill()
  }, [])
}
