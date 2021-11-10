import React, { useEffect, useState } from 'react'
import NumberText from '../texts/Number'
import useAppStore from '../../stores/useAppStore'
import useAccountStore from '../../stores/useAccountStore'


export const MainLeft: React.FC = () => {
  const [isSelect, setIsSelect] = useState(1)
  const { set: setAppStore } = useAppStore((state) => state)
  const account = useAccountStore((s) => s.account)
  const balanceOfSDT = useAccountStore((s) => s.balanceOfSDT)

  useEffect(() => {
    setAppStore((state) => {
      state.menuIndex = isSelect
    })
  }, [isSelect])

  return (
    <div className="flex flex-col bg-black items-center custom-main-left">
      <img src="/images/sign/me.png" alt="me" className="w-14 h-14 mt-7" />
      <div className=" text-default mt-5">ME</div>
      <div className=" text-default opacity-60 mt-3">{account.address.slice(0, 5) + '...' + account.address.slice(40)}</div>
      <div className=" text-default mt-3">
        <NumberText value={balanceOfSDT}
              defaultIfNull="N/A" /> SDT
      </div>
      <div className="flex justify-center items-center bg-default w-56 h-11 rounded mt-5">
        <img src="/images/sign/add.png" alt="+" className="w-4 h-4 mr-3 inline-block" />
        <span className="text-black cursor-default" onClick={() => {
          setIsSelect(4)
        }}>New Contract</span>
      </div>
      <div className="h-0 border-b border-gray-500 w-56 mt-5 custom-border-color">&nbsp;</div>
      <div className="flex flex-col items-left mt-5">
        <div className={`text-default custom-menu-item cursor-default ${isSelect === 1 ? 'select' : ''}`} onClick={() => {
          setIsSelect(1)
        }}>
          <div className="left-tip"></div>
          <img src="/images/sign/contracts_sel.png" alt="sel" className="inline-block w-5 h-5 ml-6 mr-3 menu-icon-sel" />
          <img src="/images/sign/contracts.png" alt="sel" className="inline-block w-5 h-5 ml-6 mr-3 menu-icon" />
          Contracts
        </div>
        <div className={`text-default custom-menu-item cursor-default ${isSelect === 2 ? 'select' : ''}`} onClick={() => {
          setIsSelect(2)
        }}>
          <div className="left-tip"></div>
          <img src="/images/sign/my_contract_sel.png" alt="sel" className="inline-block  w-5 h-5 ml-6 mr-3 menu-icon-sel" />
          <img src="/images/sign/my_contract.png" alt="sel" className="inline-block  w-5 h-5 ml-6 mr-3 menu-icon" />
          My Contracts
        </div>
        <div className={`text-default custom-menu-item cursor-default ${isSelect === 3 ? 'select' : ''}`} onClick={() => {
          setIsSelect(3)
        }}>
          <div className="left-tip"></div>
          <img src="/images/sign/setting_sel.png" alt="sel" className="inline-block  w-5 h-5 ml-6 mr-3 menu-icon-sel" />
          <img src="/images/sign/setting.png" alt="sel" className="inline-block  w-5 h-5 ml-6 mr-3 menu-icon" />
          Setting
        </div>
      </div>
    </div>
  )
}
