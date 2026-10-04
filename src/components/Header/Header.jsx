import { useEffect, useState } from 'react'
import { Logo } from '../Logo/Logo'
import './Header.css'

const SCROLLED_OFFSET = 24

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > SCROLLED_OFFSET)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#topo" aria-label="Medina Cyber Security, voltar ao início">
          <Logo variant="white" height={76} alt="" className="site-header__logo site-header__logo--white" />
          <Logo variant="blue" height={76} alt="" className="site-header__logo site-header__logo--blue" />
        </a>
      </div>
    </header>
  )
}
