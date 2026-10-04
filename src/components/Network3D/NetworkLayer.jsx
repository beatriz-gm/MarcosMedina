import { lazy, Suspense, useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { MOBILE_QUERY, VERTICAL_LAYOUT_QUERY } from '../../lib/media'
import { useNetworkScroll } from './useNetworkScroll'
import './NetworkLayer.css'

// Three.js lives in its own chunk, requested only once the page is idle.
const Network3D = lazy(() => import('./Network3D'))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Fixed layer behind the page content that hosts the 3D network. Section backgrounds
 * paint below it and section content above it (see `.section` in global.css).
 */
export function NetworkLayer() {
  useNetworkScroll()
  const reduceMotion = useReducedMotion()
  const isVertical = useMediaQuery(VERTICAL_LAYOUT_QUERY)
  const isLowPower = useMediaQuery(MOBILE_QUERY)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!supportsWebGL()) return undefined
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setShouldLoad(true), { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(() => setShouldLoad(true), 300)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className={`network-layer${isReady ? ' is-ready' : ''}`} aria-hidden="true">
      {shouldLoad && (
        <Suspense fallback={null}>
          <Network3D
            key={isVertical ? 'vertical' : 'wide'}
            isVertical={isVertical}
            isLowPower={isLowPower}
            reduceMotion={reduceMotion}
            onReady={() => setIsReady(true)}
          />
        </Suspense>
      )}
    </div>
  )
}
