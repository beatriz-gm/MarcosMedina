import { useRef } from 'react'
import { Icon } from '../../components/Icon/Icon'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { stats } from '../../data/experience'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './Experience.css'

export function Experience() {
  const ref = useRef(null)

  useScrollAnimation(ref, ({ isMobile }) => {
    gsap.fromTo(
      '.stats__line-fill',
      { scale: 0 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.stats',
          start: isMobile ? 'top 75%' : 'top 80%',
          end: isMobile ? 'bottom 60%' : 'top 35%',
          scrub: true,
        },
      },
    )

    gsap.utils.toArray('.stat', ref.current).forEach((stat, index) => {
      const value = stat.querySelector('.stat__number')
      const target = Number(value.dataset.value)
      const counter = { current: 0 }
      value.textContent = '0'

      gsap
        .timeline({ scrollTrigger: { trigger: stat, start: 'top 82%', once: true }, delay: isMobile ? 0 : index * 0.12 })
        .from(stat.querySelector('.stat__node'), { scale: 0, duration: 0.5, ease: 'back.out(2)' })
        .from(stat.querySelector('.stat__body'), { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
        .to(
          counter,
          {
            current: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              value.textContent = Math.round(counter.current)
            },
          },
          0.1,
        )
    })

    // Restore the real figures if the animation is torn down (breakpoint or motion change).
    return () => {
      gsap.utils.toArray('.stat__number', ref.current).forEach((number) => {
        number.textContent = number.dataset.value
      })
    }
  })

  return (
    <section
      ref={ref}
      id="experiencia"
      className="section theme-primary experience"
      data-network-state="experience"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <SectionHeading
          id="experience-title"
          eyebrow="Experiência"
          title="Conhecimento que protege negócios"
          lead="Há mais de 12 anos desenvolvendo projetos de infraestrutura e segurança de redes para empresas de diferentes segmentos, unindo experiência técnica, confiabilidade e soluções adequadas a cada operação."
        />

        <div className="stats">
          <span className="stats__line" aria-hidden="true">
            <span className="stats__line-fill" />
          </span>
          <ul className="stats__list">
            {stats.map((stat) => (
              <li key={stat.label} className="stat">
                <span className="stat__node" aria-hidden="true">
                  <Icon name={stat.icon} size={22} />
                </span>
                <div className="stat__body">
                  <p className="stat__value">
                    <span className="stat__number" data-value={stat.value}>
                      {stat.value}
                    </span>
                    {stat.suffix}
                    {stat.unit && <span className="stat__unit"> {stat.unit}</span>}
                  </p>
                  <p className="stat__label">{stat.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
