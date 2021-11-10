import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import React, { useCallback, useEffect } from 'react'
import useAccountStore from '../../stores/useAccountStore'

export const ConnectWallet: React.FC<any> = ({
  className,
}) => {
  let injectedWeb3 = null
  const { set: setAccountStore } = useAccountStore((state) => state)

  const actions = useAccountStore((s) => s.actions)
  const accounts = useAccountStore((s) => s.accounts)
  const account = useAccountStore((s) => s.account)

  const connectPolkadot = useCallback(() => {
    async function enable() {
      injectedWeb3 = await import('@polkadot/extension-dapp');
      const allInjected = await injectedWeb3.web3Enable('PolkaSign');
      const allAccounts = await injectedWeb3.web3Accounts();
    }
    enable()
  }, [])


  return (
    <div className="flex items-center">
      <select className=" h-9 border border-gray rounded text-default appearance-none bg-transparent pl-4 font-medium custom-address-select"
        onChange={(e) => {
          actions.changeAccount(e.target.value)
        }}
      >
        {
          accounts.map(account => <option key={account.address} value={account.address}>{account.address.slice(0, 5) + '...' + account.address.slice(34)}</option>)
        }
        {/* <option>6E5LL...grmHISubD4O Mainnet	</option>
        <option>7E5LL...grmHISubD4O Mainnet	</option>
        <option>9E5LL...grmHISubD4O Mainnet	</option> */}
      </select>
      <div className="ml-6 flex items-center"
        onClick={() => connectPolkadot()}
      >
        <img
          src={account.address ? '/images/sign/link.png' : '/images/sign/unlink.png'}
          alt="Parrot"
          height="40"
          className=" w-6 mr-2"
        />
        <span className={`${account.address ? 'text-secondary' : ''}`}>wallet</span>
      </div>
    </div>
  )
}

export default ConnectWallet
