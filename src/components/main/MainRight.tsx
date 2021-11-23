import React from 'react'
import useAppStore from '../../stores/useAppStore'
import { ContractsList } from '../contracts-list/ContractsList'
import { MyContracts } from '../my-contracts/MyContracts'

export const MainRight: React.FC = () => {
  const menuIndex = useAppStore(s => s.menuIndex)
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
