import React, { useEffect, useState, useCallback } from 'react'
import { Pagination } from 'antd';
import { ContractItem } from './ContractItem'
import { NoData } from '../main/NoData'
import { ButtonMenu, ButtonMenuItem } from '../menu'
import useAccountStore from '../../stores/useAccountStore'

export const ContractsList: React.FC = () => {
  const [isDeposit, setIsDeposit] = useState(true)
  const actions = useAccountStore((s) => s.actions)

  const contractListTotal = useAccountStore((s) => s.contractListTotal)
  const contractsList = useAccountStore((s) => s.contractsList)
  const account = useAccountStore((s) => s.account)
  const defaultPageSize = 5
  console.log(contractsList)
  const handleChangeMode = useCallback(
    (value: number) => {
      setIsDeposit(value === 0)
    },
    [setIsDeposit]
  )
  useEffect(() => {
    actions.fetchContracts(1, defaultPageSize)
  }, [account.address])
  return (
    <div className="w-full relative" style={{height: '100%', overflow: 'auto'}}>
      <div className="mb-4 border-b-2" style={{borderColor: '#E1E4ED'}}>
        <ButtonMenu
          activeIndex={isDeposit ? 0 : 1}
          onItemClick={handleChangeMode}
        >
          <ButtonMenuItem pos="left">Queue</ButtonMenuItem>
          <ButtonMenuItem pos="right">History</ButtonMenuItem>
        </ButtonMenu>
      </div>
      <div className="custom-shadow2 bg-black rounded-2xl custom-contract-list">
        <div>
        {
          contractsList.length > 0 && contractsList.map(contract => <ContractItem key={contract.index} contract={contract} />)
        }
        {
          contractsList.length <= 0 && <NoData />
        }
        </div>

        {/* <ContractItem />
        <ContractItem />
        <ContractItem />
        <ContractItem />
        <ContractItem last={true} /> */}
      </div>
      <div className="flex justify-end mt-5 mr-6 w-full absolute bottom-0 left-0 bg-lightgray custom-contract-list-page">
        <Pagination
          total={contractListTotal}
          onChange={(page, pageSize) => {
            actions.fetchContracts(page, pageSize)
          }}
          showSizeChanger
          showQuickJumper
          defaultPageSize={defaultPageSize}
          pageSizeOptions={['5', '10']}
          showTotal={(total) => `Total of ${total} items`}
        />
      </div>
    </div>
  )
}
