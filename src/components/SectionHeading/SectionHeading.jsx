import { useRef } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './SectionHeading.css'

/**
 * Eyebrow + title + lead. The eyebrow dot doubles as a network node: a connector
 * line runs into it from the top of the section, tying consecutive sections together.
 */
export function SectionHeading({ id, eyebrow, kicker, title, lead, align = 'start', className = '', children }) {
  const ref = useRef(null)

  useScrollAnimation(ref, () => {
    gsap.fromTo(
      '.section-heading__connector',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'top 45%', scrub: true },
      },
    )

    gsap.from('.section-heading__reveal', {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
    })
  })

  return (
    <header ref={ref} className={`section-heading section-heading--${align} ${className}`.trim()}>
      <span className="section-heading__connector" aria-hidden="true" />
      {eyebrow && <p className="eyebrow section-heading__reveal">{eyebrow}</p>}
      {kicker && <p className="section-heading__kicker section-heading__reveal">{kicker}</p>}
      <h2 id={id} className="section-title section-heading__reveal">
        {title}
      </h2>
      {lead && <p className="section-lead section-heading__reveal">{lead}</p>}
      {children}
    </header>
  )
}
