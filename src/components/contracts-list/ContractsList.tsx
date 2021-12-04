import React, { useEffect, useState, useCallback } from 'react'
import { Pagination } from 'antd';
import { ContractItem } from './ContractItem'
import { NoData } from '../main/NoData'
import { ButtonMenu, ButtonMenuItem } from '../menu'
import useAccountStore from '../../stores/useAccountStore'
import useAppStore from '../../stores/useAppStore';

export const ContractsList: React.FC = () => {
  const [isDeposit, setIsDeposit] = useState(true)
  const actions = useAccountStore((s) => s.actions)
  const {set: setAppStore} = useAppStore((s) => s)

  const contractListTotal = useAccountStore((s) => s.contractListTotal)
  const contractsList = useAccountStore((s) => s.contractsList)
  const account = useAccountStore((s) => s.account)
  const isQueue = useAppStore((s) => s.isQueue)

  const defaultPageSize = 5
  const handleChangeMode = useCallback(
    (value: number) => {
      setIsDeposit(value === 0)
      setAppStore(state => {
        state.isQueue = value
      })
      if (value === 1) {
        actions.fetchContracts('', account.address, '[2]', 0, defaultPageSize, 'desc')
      } else {
        actions.fetchContracts('', account.address, '[0,1]', 0, defaultPageSize, 'desc')
      }
    },
    [setIsDeposit, account]
  )

  useEffect(() => {
    if (account.address) {
      actions.fetchContracts('', account.address, '[0,1]', 0, defaultPageSize, 'desc')
    }
  }, [account.address])
  return (
    <div className="w-full relative" style={{height: '100%', overflow: 'auto'}}>
      <div className="mb-4 border-b-2" style={{borderColor: '#E1E4ED'}}>
        <ButtonMenu
          activeIndex={isQueue}
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
            setAppStore(state => {
              state.pageInfo = {page, pageSize}
            })
            actions.fetchContracts('', account.address, isQueue === 1 ? '[2]' : '[1,0]', page - 1, pageSize, 'desc')
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
