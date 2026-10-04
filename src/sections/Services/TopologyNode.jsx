import { Icon } from '../../components/Icon/Icon'

export function TopologyNode({ service, isActive, onSelect }) {
  const descriptionId = `servico-${service.id}-descricao`
  const select = () => onSelect(service.id)

  return (
    <li
      className={`topology__node${isActive ? ' is-active' : ''}`}
      style={{ '--x': `${service.position.x}%`, '--y': `${service.position.y}%` }}
    >
      <button
        type="button"
        className="topology__node-button"
        aria-pressed={isActive}
        aria-describedby={descriptionId}
        onClick={select}
        onMouseEnter={select}
        onFocus={select}
      >
        <span className="topology__node-icon" aria-hidden="true">
          <Icon name={service.icon} size={26} />
        </span>
        <span className="topology__node-title">{service.title}</span>
      </button>
      <p id={descriptionId} className="topology__node-description">
        {service.description}
      </p>
    </li>
  )
}
