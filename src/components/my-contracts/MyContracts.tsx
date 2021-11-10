import React, { useEffect, useState, useCallback } from 'react'
import { Table, Tag, Space, Pagination, Select, Input } from 'antd';
import { CIcon } from '../icons'
import useModal from '../../hooks/useModal'
import { ReviewSend } from '../../components/review-send';
import useAccountStore from '../../stores/useAccountStore'

const { Option } = Select;
const { Search } = Input;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

export const MyContracts: React.FC = () => {
  const actions = useAccountStore((s) => s.actions)
  const contractMyTotal = useAccountStore((s) => s.contractMyTotal)
  const contractsMyList = useAccountStore((s) => s.contractsMyList)
  const account = useAccountStore((s) => s.account)
  const defaultPageSize = 5
  const [nowItem, setNowItem] = useState({})

  const [onPresentConnectWallet, onDismiss] = useModal(<ReviewSend nowItem={nowItem} close={() => {
    onDismiss()
  }} />)

  useEffect(() => {
    actions.fetchContractsMy(1, defaultPageSize)
  }, [account.address])

  const columns = [
    {
      title: 'Scheme',
      dataIndex: 'name',
      key: 'name',
      // render: text => <a>{text}</a>,
    },
    {
      title: 'State',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const stateText = record.signtory ? <span>Signed</span> : <span className="custom-color-green">Waiting</span>
        return (
          <div>Waiting</div>
        )
      },
    },
    {
      title: 'Founder',
      dataIndex: 'founder',
      key: 'founder',
    },
    {
      title: 'Signtory',
      dataIndex: 'signtory',
      key: 'signtory',
      render: (text, record) => {
        const stateText = record.signtory ? <span>Signed</span> : <span className="custom-color-green">Waiting</span>
        return (
          <div>Me {stateText}</div>
        )
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <Space size="middle">
          <CIcon icon="check" size="18" onClick={() => {
            setNowItem(record)
            onPresentConnectWallet()
          }} />
          <CIcon icon="down" size="17" />
          <CIcon icon="history" size="17" />
          <CIcon icon="info" size="18" />

        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'I Invoice755105449.of',
      status: 'Has been completed',
      founder: '0665878sd8889',
      signtory: 'Me',
      signState: 0,
      operation: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'I Invoice755105449.of',
      status: 'Has been completed',
      founder: '0665878sd8889',
      signtory: 'Me',
      signState: 0,
      operation: ['loser'],
    },
    {
      key: '3',
      name: 'I Invoice755105449.of',
      status: 'Has been completed',
      founder: '0665878sd8889',
      signtory: 'Me',
      signState: 1,
      operation: ['cool', 'teacher'],
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  const onSearch = value => console.log(value);
  return (
    <div className="w-full custom-my-contracts">

      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <span className=" font-bold">I created</span>
          <img src="/images/icons/arrow-right.png" alt="" className="w-2 h-3 ml-3" />
          <Select defaultValue="lucy" style={{ width: 80 }} onChange={handleChange}>
            <Option value="jack">All</Option>
            <Option value="lucy">Sort</Option>
            <Option value="Yiminghe">Desc</Option>
          </Select>
        </div>
        <div className=" ml-24">
          <Search placeholder="Querying a File Name" onSearch={onSearch} style={{ width: 300 }} />
        </div>
      </div>
      <div className=" custom-h rounded-2xl custom-shadow2 overflow-hidden bg-black custom-my-table">
        <Table
          pagination={false}
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns} dataSource={contractsMyList} />
        <div className="flex justify-end mt-5 mr-6">
          <Pagination
            total={contractMyTotal}
            onChange={(page, pageSize) => {
              actions.fetchContractsMy(page, pageSize)
            }}
            showSizeChanger
            showQuickJumper
            defaultPageSize={defaultPageSize}
            pageSizeOptions={['5', '10']}
            showTotal={(total) => `Total of ${total} items`}
          />
        </div>
      </div>

    </div>
  )
}
