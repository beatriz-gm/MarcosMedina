import { useEffect, useState } from 'react'
import { site } from '../../data/site'
import { Icon } from '../Icon/Icon'
import './FloatingWhatsApp.css'

/**
 * Mobile-only shortcut to the main conversion. It stays out of the way while the hero
 * or the contact section (which already show the call to action) are on screen.
 */
export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const targets = ['topo', 'contato'].map((id) => document.getElementById(id)).filter(Boolean)
    const visibleTargets = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.add(entry.target)
          else visibleTargets.delete(entry.target)
        })
        setIsVisible(visibleTargets.size === 0)
      },
      { threshold: 0.15 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <a
      className={`floating-whatsapp${isVisible ? ' is-visible' : ''}`}
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isVisible ? undefined : -1}
      aria-hidden={isVisible ? undefined : 'true'}
    >
      <Icon name="whatsapp" size={22} />
      <span>Falar com especialista</span>
      <span className="visually-hidden"> pelo WhatsApp (abre em nova aba)</span>
    </a>
  )
}
