import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'

import { buttonClassNames, type ButtonSize, type ButtonVariant } from './buttonStyles'

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant
  size?: ButtonSize
}

/** A react-router Link styled like Button, for navigation actions that should look like buttons. */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClassNames(variant, size, className)} {...props} />
}
