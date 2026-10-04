import { servicesHub } from '../../data/services'

const PACKET_OFFSETS = [0, -0.6]

/** SVG links of the desktop topology: a ring between services and spokes to the hub. */
export function TopologyLinks({ services, activeId, animate }) {
  const hub = servicesHub.position
  const points = services.map(({ position }) => `${position.x},${position.y}`)
  const active = services.find((service) => service.id === activeId)
  const activePath = `M${hub.x} ${hub.y} L${active.position.x} ${active.position.y}`

  return (
    <svg className="topology__links" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <polygon className="topology__ring" points={points.join(' ')} />
      {services.map((service) => (
        <line
          key={service.id}
          className={`topology__spoke${service.id === activeId ? ' is-active' : ''}`}
          x1={hub.x}
          y1={hub.y}
          x2={service.position.x}
          y2={service.position.y}
        />
      ))}

      {animate && (
        <>
          <circle className="topology__packet topology__packet--ring" r="0.8">
            <animateMotion dur="16s" repeatCount="indefinite" path={`M${points.join(' L')} Z`} />
          </circle>
          {PACKET_OFFSETS.map((offset) => (
            <circle key={`${activeId}${offset}`} className="topology__packet" r="1.1">
              <animateMotion dur="1.2s" begin={`${offset}s`} repeatCount="indefinite" path={activePath} />
            </circle>
          ))}
        </>
      )}
    </svg>
  )
}
