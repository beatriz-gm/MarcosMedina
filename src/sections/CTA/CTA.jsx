import { useRef } from 'react'
import { Button } from '../../components/Button/Button'
import { Icon } from '../../components/Icon/Icon'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { site } from '../../data/site'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './CTA.css'

export function CTA() {
  const ref = useRef(null)

  useScrollAnimation(ref, () => {
    gsap.from('.cta__actions > *', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.cta__actions', start: 'top 90%', once: true },
    })
  })

  return (
    <section
      ref={ref}
      id="contato"
      className="section theme-primary cta"
      data-network-state="cta"
      aria-labelledby="cta-title"
    >
      <div className="container cta__inner">
        <SectionHeading
          id="cta-title"
          eyebrow="Contato"
          title="Vamos avaliar a infraestrutura da sua empresa?"
          lead="Entenda quais soluções podem tornar sua rede mais segura e preparada para a sua operação."
        />

        <div className="cta__actions">
          <Button href={site.whatsappUrl} external variant="light" icon="whatsapp">
            Falar com especialista
          </Button>
          <a className="cta__email" href={`mailto:${site.email}`}>
            <Icon name="mail" size={20} />
            {site.email}
          </a>
        </div>
      </div>
    </section>
  )
}
