import { useEffect, useLayoutEffect } from 'react'
import { gsap } from '../lib/gsap'
import { MOBILE_QUERY, REDUCED_MOTION_QUERY } from '../lib/media'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const conditions = {
  isMobile: MOBILE_QUERY,
  isDesktop: `not all and ${MOBILE_QUERY}`,
  reduceMotion: REDUCED_MOTION_QUERY,
}

/**
 * Runs a GSAP setup scoped to `scopeRef`, re-running it when the breakpoint or the
 * motion preference changes. Selector strings inside `setup` resolve within the scope,
 * and every tween/ScrollTrigger is reverted on unmount. With reduced motion the setup
 * is skipped entirely, so content simply stays in its final, static state.
 */
export function useScrollAnimation(scopeRef, setup, deps = []) {
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef.current)

    mm.add(conditions, (context) => {
      const { isMobile, reduceMotion } = context.conditions
      if (reduceMotion) return undefined
      return setup({ isMobile, scope: scopeRef.current })
    })

    return () => mm.revert()
  }, deps)
}
