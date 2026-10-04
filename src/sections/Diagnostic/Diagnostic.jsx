import { useRef } from 'react'
import { networkStore } from '../../components/Network3D/networkStore'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { warningSigns } from '../../data/diagnostic'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { Pillars } from './Pillars'
import './Diagnostic.css'

export function Diagnostic() {
  const ref = useRef(null)

  useScrollAnimation(ref, () => {
    const list = ref.current.querySelector('.signs')
    const items = gsap.utils.toArray('.signs__item', list)

    // Each sign "switches on" as it crosses the reading line, and lights up the
    // matching critical point in the 3D network.
    list.classList.add('is-sequenced')
    items.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 72%',
        onEnter: () => {
          item.classList.add('is-active')
          networkStore.riskLevel = Math.max(networkStore.riskLevel, index + 1)
        },
        onLeaveBack: () => {
          item.classList.remove('is-active')
          networkStore.riskLevel = index
        },
      })
    })

    return () => {
      list.classList.remove('is-sequenced')
      items.forEach((item) => item.classList.remove('is-active'))
      networkStore.riskLevel = 0
    }
  })

  return (
    <section
      ref={ref}
      id="diagnostico"
      className="section theme-light diagnostic"
      data-network-state="diagnostic"
      aria-labelledby="diagnostic-title"
    >
      <div className="container">
        <div className="diagnostic__grid">
          <SectionHeading
            id="diagnostic-title"
            eyebrow="Diagnóstico"
            kicker="Sua infraestrutura está preparada para o seu negócio?"
            title="Não espere um problema para descobrir."
            lead="Antecipar riscos é parte de manter sua operação segura e disponível."
            className="diagnostic__heading"
          />

          <div className="signs">
            <h3 className="signs__title">Alguns sinais merecem atenção:</h3>
            <ol className="signs__list">
              {warningSigns.map((sign, index) => (
                <li key={sign} className="signs__item">
                  <span className="signs__marker" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p>{sign}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Pillars />
      </div>
    </section>
  )
}
