import { useRef } from 'react'
import { Button } from '../../components/Button/Button'
import { Icon } from '../../components/Icon/Icon'
import { heroTags, site } from '../../data/site'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { gsap } from '../../lib/gsap'
import './Hero.css'

export function Hero() {
  const ref = useRef(null)

  useScrollAnimation(ref, ({ isMobile }) => {
    // Items start hidden via CSS (see animations.css); hand control over to GSAP.
    document.documentElement.classList.add('hero-animated')

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
    intro
      .fromTo('.hero__title-line', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 })
      .fromTo('[data-hero-reveal]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0)
      .fromTo('.hero__tag', { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06 }, 0.35)

    if (!isMobile) {
      // Content drifts up and fades as the visitor dives into the network.
      gsap.to('.hero__content', {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    return () => document.documentElement.classList.remove('hero-animated')
  })

  return (
    <section
      ref={ref}
      id="topo"
      className="hero theme-primary"
      data-network-state="hero"
      aria-labelledby="hero-title"
    >
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            <span className="hero__title-mask">
              <span className="hero__title-line">Sua empresa está</span>
            </span>{' '}
            <span className="hero__title-mask">
              <span className="hero__title-line">realmente protegida?</span>
            </span>
          </h1>

          <p className="hero__lead" data-hero-reveal>
            Segurança e infraestrutura de redes para manter seus dados protegidos, seus sistemas disponíveis e sua
            operação funcionando.
          </p>

          <ul className="hero__tags" aria-label="Soluções" data-hero-reveal>
            {heroTags.map((tag) => (
              <li key={tag} className="hero__tag">
                {tag}
              </li>
            ))}
          </ul>

          <div className="hero__actions" data-hero-reveal>
            <Button href={site.whatsappUrl} external variant="light" icon="whatsapp">
              Falar com especialista
            </Button>
            <a className="hero__secondary" href="#servicos">
              Conheça as soluções
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#beneficios" aria-label="Ir para a próxima seção">
        <span className="hero__scroll-line" aria-hidden="true" />
        <Icon name="arrowDown" size={18} />
      </a>
    </section>
  )
}
