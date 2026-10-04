import { useRef } from 'react'
import { Icon } from '../../components/Icon/Icon'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { benefits } from '../../data/benefits'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './Benefits.css'

export function Benefits() {
  const ref = useRef(null)

  useScrollAnimation(ref, () => {
    // The data line fills as the visitor reads down the list.
    gsap.fromTo(
      '.benefits__progress',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.benefits__flow', start: 'top 70%', end: 'bottom 60%', scrub: true },
      },
    )

    gsap.utils.toArray('.benefits__item', ref.current).forEach((item) => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 78%', once: true } })
      timeline
        .from(item.querySelector('.benefits__node'), { scale: 0.4, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
        .from(item.querySelector('.benefits__text'), { x: 24, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    })
  })

  return (
    <section
      ref={ref}
      id="beneficios"
      className="section theme-light benefits"
      data-network-state="benefits"
      aria-labelledby="benefits-title"
    >
      <div className="container benefits__grid">
        <SectionHeading
          id="benefits-title"
          eyebrow="Por que importa"
          title="Uma falha na rede pode custar mais do que você imagina."
          lead="Sua empresa depende da tecnologia para funcionar todos os dias. Uma rede mal configurada, acessos inadequados ou uma infraestrutura sem proteção podem comprometer a operação, os dados e a produtividade da sua equipe."
          className="benefits__heading"
        />

        <div className="benefits__flow">
          <span className="benefits__track" aria-hidden="true">
            <span className="benefits__progress" />
          </span>
          <ol className="benefits__list">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="benefits__item">
                <span className="benefits__node" aria-hidden="true">
                  <Icon name={benefit.icon} size={26} />
                </span>
                <div className="benefits__text">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
