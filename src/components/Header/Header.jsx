import { Logo } from '../Logo/Logo'
import './Header.css'

// Sits over the hero only: it scrolls away with the page instead of following it.
export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#topo" aria-label="Medina Cyber Security, voltar ao início">
          <Logo variant="white" height={80} alt="" className="site-header__logo" />
        </a>
      </div>
    </header>
  )
}
