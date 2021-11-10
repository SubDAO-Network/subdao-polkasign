import React, { useEffect, useState, useCallback } from 'react'
import useAppStore from '../../stores/useAppStore'
import { ButtonMenu, ButtonMenuItem } from '../menu'
import { NoData } from './NoData'
import { ContractsList } from '../contracts-list/ContractsList'
import { MyContracts } from '../my-contracts/MyContracts'

export const MainRight: React.FC = () => {
  const menuIndex = useAppStore(s => s.menuIndex)

  const [isSelect, setIsSelect] = useState(1)
  const { set: setAppStore } = useAppStore((state) => state)
  const [isDeposit, setIsDeposit] = useState(true)

  const handleChangeMode = useCallback(
    (value: number) => {
      setIsDeposit(value === 0)
    },
    [setIsDeposit]
  )


  return (
    <div className="flex w-full flex-col custom-main-right pl-6 pr-6 pt-7 pb-7">

      {/* <NoData /> */}
      {
        menuIndex === 1 && <ContractsList />
      }
      {
        menuIndex === 2 && <MyContracts />
      }
    </div>
  )
}
