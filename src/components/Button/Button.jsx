import { Icon } from '../Icon/Icon'
import './Button.css'

/**
 * Link styled as a button. `variant`: "solid" (blue on light backgrounds),
 * "light" (white on blue backgrounds) or "outline".
 */
export function Button({
  href,
  children,
  variant = 'solid',
  size = 'md',
  icon,
  trailingArrow = true,
  external = false,
  className = '',
  ...rest
}) {
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      className={`button button--${variant} button--${size} ${className}`.trim()}
      {...externalProps}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 18 : 20} className="button__icon" />}
      <span className="button__label">{children}</span>
      {trailingArrow && <Icon name="arrowRight" size={18} strokeWidth={2} className="button__arrow" />}
      {external && <span className="visually-hidden"> (abre em nova aba)</span>}
    </a>
  )
}
