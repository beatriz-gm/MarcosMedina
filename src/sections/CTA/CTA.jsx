import { useRef } from 'react'
import { Button } from '../../components/Button/Button'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { site } from '../../data/site'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './CTA.css'

export function CTA() {
  const ref = useRef(null)

  useScrollAnimation(ref, () => {
    gsap.from('.cta__actions', {
      y: 20,
      opacity: 0,
      duration: 0.8,
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
      {/* The converged network rests, still, at the centre of the screen behind this content. */}
      <div className="container cta__inner">
        <SectionHeading
          id="cta-title"
          eyebrow="Contato"
          title="Vamos avaliar a infraestrutura da sua empresa?"
          lead="Entenda quais soluções podem tornar sua rede mais segura e preparada para a sua operação."
          align="center"
        />

        <div className="cta__actions">
          <Button href={site.whatsappUrl} external variant="light" icon="whatsapp">
            Falar com especialista
          </Button>
        </div>
      </div>
    </section>
  )
}
