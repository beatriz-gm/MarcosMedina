import { Icon } from '../../components/Icon/Icon'

const pad = (value) => String(value).padStart(2, '0')

/**
 * Visual summary of the selected service (desktop/tablet). Hidden from assistive
 * technology: each topology button already exposes the same description.
 */
export function ServiceDetail({ service, index, total }) {
  return (
    <div className="service-detail" aria-hidden="true">
      <div key={service.id} className="service-detail__body">
        <p className="service-detail__index">
          <strong>{pad(index + 1)}</strong> / {pad(total)}
        </p>
        <span className="service-detail__icon">
          <Icon name={service.icon} size={30} />
        </span>
        <p className="service-detail__title">{service.title}</p>
        <p className="service-detail__description">{service.description}</p>
      </div>
      <div className="service-detail__steps">
        {Array.from({ length: total }, (_, step) => (
          <span key={step} className={step === index ? 'is-active' : undefined} />
        ))}
      </div>
    </div>
  )
}
