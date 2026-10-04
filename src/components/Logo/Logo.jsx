const LOGO_SOURCES = {
  white: '/images/logos/logo-medina-white.svg',
  blue: '/images/logos/logo-medina-blue.svg',
}

const LOGO_RATIO = 218.75 / 128

// Original logo artwork, only recoloured per background.
export function Logo({ variant = 'white', className, height = 56, alt = 'Medina Cyber Security' }) {
  return (
    <img
      className={className}
      src={LOGO_SOURCES[variant]}
      alt={alt}
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      decoding="async"
    />
  )
}
