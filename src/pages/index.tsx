import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import moment from 'moment'

import { Footer } from '../components/footer'
import { Header } from '../components/header'
import useAccountStore from '../stores/useAccountStore'
import { MainLeft } from '../components/main/MainLeft'
import { MainRight } from '../components/main/MainRight'
import { NewContract } from '../components/new-contract/index'
import { SignPdf } from '../components/new-contract/SignPdf'
import useAppStore from '../stores/useAppStore'


const Main = () => {
  return (
    <main className="w-full flex custom-main-root">
      <MainLeft />
      <MainRight />
    </main>
  )
}


const Page: React.FC = () => {
  let injectedWeb3 = null
  const menuIndex = useAppStore(s => s.menuIndex)
  const actions = useAccountStore((s) => s.actions)
  const account = useAccountStore((s) => s.account)
  const actionsApp = useAppStore((s) => s.actions)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (account.address) {
      actions.fetchBlanceOf(account.address)
    }
  }, [account.address])

  useEffect(() => {
    async function enable() {
      injectedWeb3 = await import('@polkadot/extension-dapp');
      await actions.accountInit(injectedWeb3)
      const fileResult = await actionsApp.fleekGet('abc.txt')
      console.log(fileResult)
      // actions.attachResourceToAgreement('11', fileResult.hash, fileResult.publicUrl, res => {
      //   console.log(res)
      // })
    }
    enable()
  }, [])
  return (
    <div className="min-h-screen flex flex-col custom-h">
      <Header />
      <div className=" pt-20 pb-4 w-full flex justify-center custom-h">
        {menuIndex < 4 && <Main />}
        {menuIndex === 4 && <NewContract />}
        {menuIndex === 5 && <SignPdf />}

      </div>
    </div>
  )
}

export default Page
