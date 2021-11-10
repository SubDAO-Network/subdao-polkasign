import classNames from 'classnames'
import React from 'react'

import { variants } from '../button/types'
import { ButtonMenuItemProps } from './types'

const ButtonMenuItem: React.FC<ButtonMenuItemProps> = ({
  isActive = false,
  variant = variants.PRIMARY,
  children,
  pos,
  ...props
}: ButtonMenuItemProps) => {
  return (
    <button
      className={classNames(
        'focus:outline-none border-b-2 font-normal custom-menu-item2',
        `btn-${variant}`,
        `btn-${pos}`,
        {
          'text-brandPrimary': isActive,
          'text-default ': !isActive,
          'border-brandPrimary': isActive,
          'border-transparent': !isActive,
          'font-semibold': isActive,
          'font-normal': !isActive,
          'opacity-100': isActive,
          'opacity-80': !isActive,
          'text-disabled': props.disabled,
          'cursor-not-allowed': props.disabled,
        }
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default ButtonMenuItem
