import { Icon } from '../../components/Icon/Icon'
import { Logo } from '../../components/Logo/Logo'
import { heroTags, navigation, site } from '../../data/site'
import './Footer.css'

const contactLinks = [
  { icon: 'mail', label: site.email, href: `mailto:${site.email}` },
  { icon: 'phone', label: site.phoneDisplay, href: site.phoneHref },
]

const socialLinks = [
  { icon: 'whatsapp', label: 'WhatsApp', href: site.whatsappUrl },
  { icon: 'instagram', label: `Instagram ${site.instagramHandle}`, href: site.instagramUrl },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo variant="blue" height={72} />
            <p>{heroTags.join(' • ')}</p>
          </div>

          <nav className="footer__column" aria-label="Seções">
            <h2 className="footer__title">Navegação</h2>
            <ul>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__column">
            <h2 className="footer__title">Contato</h2>
            <ul>
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>
                    <Icon name={link.icon} size={18} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="footer__social">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (abre em nova aba)`}>
                    <Icon name={link.icon} size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h2 className="footer__title">Atendimento</h2>
            <p className="footer__area">
              <Icon name="mapPin" size={18} />
              <span>
                {site.serviceArea[0]}
                <br />
                {site.serviceArea[1]}
              </span>
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>
          <p>Desenvolvido por {site.developer}</p>
        </div>
      </div>
    </footer>
  )
}
