import { useEffect, useRef, useState } from 'react'
import { BrandSymbol } from '../../components/BrandSymbol/BrandSymbol'
import { Button } from '../../components/Button/Button'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { services } from '../../data/services'
import { site } from '../../data/site'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { MOBILE_QUERY } from '../../lib/media'
import { ServiceDetail } from './ServiceDetail'
import { TopologyLinks } from './TopologyLinks'
import { TopologyNode } from './TopologyNode'
import './Services.css'

const AUTO_ADVANCE_MS = 4200

export function Services() {
  const ref = useRef(null)
  const topologyRef = useRef(null)
  const [activeId, setActiveId] = useState(services[0].id)
  const [isTouched, setIsTouched] = useState(false)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const reduceMotion = useReducedMotion()
  const activeIndex = services.findIndex((service) => service.id === activeId)

  const select = (id) => {
    setIsTouched(true)
    setActiveId(id)
  }

  // Desktop: walk through the topology on its own until the visitor interacts with it.
  useEffect(() => {
    if (isTouched || isMobile || reduceMotion) return undefined
    let timer
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer)
        if (!entry.isIntersecting) return
        timer = window.setInterval(() => {
          setActiveId((current) => {
            const index = services.findIndex((service) => service.id === current)
            return services[(index + 1) % services.length].id
          })
        }, AUTO_ADVANCE_MS)
      },
      { threshold: 0.5 },
    )
    observer.observe(topologyRef.current)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [isTouched, isMobile, reduceMotion])

  useScrollAnimation(ref, ({ isMobile: mobile }) => {
    if (mobile) {
      gsap.fromTo(
        '.topology__trunk-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.topology__nodes', start: 'top 65%', end: 'bottom 65%', scrub: true },
        },
      )
      // On touch screens the active node simply follows the scroll position.
      gsap.utils.toArray('.topology__node', ref.current).forEach((node, index) => {
        gsap.from(node, {
          opacity: 0,
          x: 20,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 85%', once: true },
        })
        ScrollTrigger.create({
          trigger: node,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => self.isActive && setActiveId(services[index].id),
        })
      })
      return
    }

    const timeline = gsap.timeline({ scrollTrigger: { trigger: topologyRef.current, start: 'top 75%', once: true } })
    timeline
      .from('.topology__hub', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' })
      .from('.topology__spoke, .topology__ring', { opacity: 0, duration: 0.6, stagger: 0.04 }, 0.2)
      .from('.topology__node', { scale: 0.5, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.6)' }, 0.3)
      .from('.service-detail', { x: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.4)
  })

  return (
    <section
      ref={ref}
      id="servicos"
      className="section theme-light services"
      data-network-state="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <SectionHeading
          id="services-title"
          eyebrow="Soluções"
          title="Soluções para uma infraestrutura mais segura"
          lead="Tecnologia e segurança aplicadas às necessidades da sua operação."
        />

        <div className="services__layout">
          <div className="topology" ref={topologyRef}>
            <TopologyLinks services={services} activeId={activeId} animate={!reduceMotion} />

            <div className="topology__hub">
              <span className="topology__hub-core">
                <BrandSymbol className="topology__hub-symbol" />
              </span>
              <span className="topology__hub-label">Sua operação</span>
            </div>

            <span className="topology__trunk" aria-hidden="true">
              <span className="topology__trunk-fill" />
            </span>

            <ul className="topology__nodes" aria-label="Serviços">
              {services.map((service) => (
                <TopologyNode
                  key={service.id}
                  service={service}
                  isActive={service.id === activeId}
                  onSelect={select}
                />
              ))}
            </ul>
          </div>

          <ServiceDetail service={services[activeIndex]} index={activeIndex} total={services.length} />
        </div>

        <div className="services__cta">
          <p>Quer entender qual solução faz sentido para a sua operação?</p>
          <Button href={site.whatsappUrl} external icon="whatsapp">
            Falar com especialista
          </Button>
        </div>
      </div>
    </section>
  )
}
