import React, { useState } from 'react'

interface TokenIconProps {
  className?: string
  onClick?: () => any
  icon: string
  size: string
}

const TokenIcon: React.FC<TokenIconProps> = ({
  className,
  onClick,
  size = '18',
  icon,
}) => {
  const iconUrl = icon?.startsWith('http') ? icon : `/images/icons/${icon}.png`
  const [showUrl, setShowUrl] = useState(iconUrl)

  return (
    <img
      onMouseEnter={() => {
        const iconUrlM = icon?.startsWith('http') ? icon : `/images/icons/${icon}_sel.png`
        setShowUrl(iconUrlM)
      }}
      onMouseLeave={() => {
        setShowUrl(iconUrl)
      }}
      onClick={() => {
        onClick && onClick()
      }}
      className={className}
      src={showUrl}
      width={size}
      height={'auto'}
    />
  )
}

export default TokenIcon
