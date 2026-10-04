import './Marquee.css'

/**
 * Infinite horizontal ticker. The list is rendered twice so the CSS animation can
 * loop seamlessly; the copy is hidden from assistive technology.
 */
export function Marquee({ items, direction = 'left', duration = 40, label }) {
  const renderItems = (hidden) => (
    <ul className="marquee__list" aria-hidden={hidden || undefined} aria-label={hidden ? undefined : label}>
      {items.map((item) => (
        <li key={item} className="marquee__item">
          <span className="marquee__node" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={`marquee marquee--${direction}`} style={{ '--marquee-duration': `${duration}s` }}>
      <div className="marquee__track">
        {renderItems(false)}
        {renderItems(true)}
      </div>
    </div>
  )
}
