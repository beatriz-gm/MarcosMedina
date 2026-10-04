import { brandIcons, lineIcons } from '../../assets/icons/icons'

export function Icon({ name, size = 24, strokeWidth = 1.6, className }) {
  const brandPath = brandIcons[name]

  if (brandPath) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d={brandPath} />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {lineIcons[name]}
    </svg>
  )
}
