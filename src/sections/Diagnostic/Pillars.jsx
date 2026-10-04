import { useRef, useState } from 'react'
import { BrandSymbol } from '../../components/BrandSymbol/BrandSymbol'
import { pillars } from '../../data/diagnostic'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'

// Triangle vertices (0–100 space), in the same order as the pillars data.
const VERTICES = [
  { x: 50, y: 10 },
  { x: 10, y: 80 },
  { x: 90, y: 80 },
]

export function Pillars() {
  const ref = useRef(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const outline = `M${VERTICES.map(({ x, y }) => `${x} ${y}`).join(' L')} Z`

  useScrollAnimation(ref, () => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true } })
    timeline
      .fromTo('.pillars__outline', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' })
      .from('.pillars__vertex', { scale: 0, transformOrigin: 'center', duration: 0.5, stagger: 0.15, ease: 'back.out(2)' }, 0.2)
      .from('.pillars__item', { y: 24, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 0.3)
  })

  return (
    <div ref={ref} className="pillars">
      <div className="pillars__intro">
        <h3 className="pillars__title">Integridade. Disponibilidade. Segurança.</h3>
        <p className="pillars__lead">Três pilares para uma infraestrutura preparada para o seu negócio.</p>
      </div>

      <div className="pillars__body">
        <div className="pillars__diagram" aria-hidden="true">
          <svg viewBox="0 0 100 90" focusable="false">
            <path className="pillars__outline" d={outline} pathLength="1" />
            {VERTICES.map(({ x, y }, index) => (
              <g key={index} className={`pillars__vertex${activeIndex === index ? ' is-active' : ''}`}>
                <circle cx={x} cy={y} r="5.5" />
                <text x={x} y={y + 1.6} textAnchor="middle">
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
          <BrandSymbol className="pillars__symbol" />
        </div>

        <ol className="pillars__list">
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className={`pillars__item${activeIndex === index ? ' is-active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="pillars__number" aria-hidden="true">
                {index + 1}
              </span>
              <div>
                <h4>{pillar.title}</h4>
                <p>{pillar.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
