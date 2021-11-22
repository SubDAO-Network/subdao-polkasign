import React from 'react'
import useAppStore from '../../stores/useAppStore'
import ConnectWallet from '../account/ConnectWallet'
import { Logo } from '../logo'

export const Header: React.FC = () => {
  const { set: setAppStore } = useAppStore((state) => state)
  return (
    <header className="absolute top-0 w-full z-10 flex justify-around bg-black custom-shadow">
      <div className="flex flex-row items-center justify-between h-20 w-full pl-16 pr-16">
        <div onClick={() => {
          setAppStore(state => {
            state.menuIndex = 1
          })
        }}>
          <Logo />
        </div>
        <div className="flex flex-row items-center justify-end space-x-2 sm:space-x-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  )
}
