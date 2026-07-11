import logoSrc from '@/assets/logo.png'

export interface LogoProps {
  className?: string
}

/** The Preproute wordmark — shared by the login page and the app sidebar (both shown in Figma). */
export function Logo({ className }: LogoProps) {
  return <img src={logoSrc} alt="Preproute" className={className} />
}
