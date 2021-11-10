import React, { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard';
import { Toast } from 'antd-mobile';
import { message } from 'antd'


interface ContractItemProps {
  last?: boolean,
  contract: any
}

export const ContractItem: React.FC<ContractItemProps> = ({
  last,
  contract
}) => {

  const [isActive, setActive] = useState(false)

  return (
      <div className={classNames(
          'w-full  hover:bg-lightgray',
          {
            'bg-lightgray': isActive,
            'bg-black': !isActive,
          }
        )}
      >
        <div className={classNames("w-full flex justify-between items-center h-16 pl-6 pr-6",
          {
            'custom-item-content': !last
          }

        )} onClick={() => {
          setActive(!isActive)
        }}>
          <div className="text-default w-1/3">{contract.name} </div>
          <div className="text-default w-1/3 opacity-80 text-right">{contract.newDate} </div>
          <div className={`${contract.status < 2 ? 'text-brandPrimary w-1/3 opacity-80 flex items-center justify-end' : ' w-1/3 opacity-80 flex items-center  justify-end'}`}>
            {contract.status < 2 ? 'Waiting': 'Finished'}
            <img src={isActive ? '/images/icons/sort-up.png' : '/images/icons/sort-down.png'} alt="" className=" w-3 h-2 ml-4" />
          </div>
        </div>
        {
          isActive &&
          <div className="bg-black">
            <div className="flex bg-black border-b-2" style={{borderColor: '#BBC8CE'}}>
              <div className="pl-6 pr-6 pt-7 pb-7  w-1/2 border-r border-lightgray">
                <div className="flex items-center text-sm mb-5">
                  <div>
                    <span className="font-semibold">Tx Hash：</span>  -
                  </div>
                  {/* <img src="/images/icons/copy.png" alt="Copy" className="inline-block w-4 h-4 ml-2" /> */}
                </div>
                <div className="flex items-center w-full text-sm mb-5 truncate" style={{maxWidth: 332}}>
                  <div>
                    <span className="font-semibold">File Hash：</span>  {contract.agreementFile.hash_}
                  </div>
                  <CopyToClipboard text={contract.agreementFile.hash_} onCopy={(e) => { message.success({content: '复制成功'}) }}
                  >
                    <img src="/images/icons/copy.png" alt="Copy" className="inline-block w-4 h-4 ml-2" />
                  </CopyToClipboard>

                </div>
                <div className="flex items-center text-sm mb-6">
                  <div>
                    <span className="font-semibold">Created：</span>  {moment.unix(contract.agreementFile.saveAt * 1).format('h:mm a YYYY/MM/DD')}
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="border border-gray text-default opacity-80 flex justify-center items-center w-20 h-8 rounded cursor-default hover:text-brandPrimary hover:border-brandPrimary">View</div>
                </div>
              </div>
              <div className="pr-6 pt-7 pb-7  w-1/2 text-sm relative contract-item-text">
                <div className="relative">
                  <div className="custom-process-line"></div>
                  <div className="mb-4 font-semibold flex items-center relative">
                    <img src="/images/icons/contract_gray.png" className="w-6 h-6 mr-3" alt="" />
                    Waiting
                  </div>
                  {contract.signers.map(signer => <div key={signer} className="opacity-80 mb-3 pl-9">{signer}</div>)}
                  {/* <div className="opacity-80 mb-3 pl-5">5FCQ2wm6eSh5FCQ2wm6eSh5FCQ2wm6eSh</div>
                  <div className="opacity-80 mb-5 pl-5">5FCQ2wm6eSh5FCQ2wm6eSh5FCQ2wm6eS2wm6eSh...</div> */}
                </div>
                <div className="mb-4 font-semibold custom-color-green relative z-10 flex items-center">
                  <img src="/images/icons/contract_green.png" className="w-6 h-6 mr-3" alt="" />
                  Singed
                </div>
                {/* <div className="opacity-80 mb-3 pl-5">5FCQ2wm6eSh5FCQh</div>
                <div className="opacity-80 mb-5 pl-5">5FCQ2wm6eSh5FCQ</div> */}

              </div>
            </div>
          </div>
        }

      </div>
  )
}
