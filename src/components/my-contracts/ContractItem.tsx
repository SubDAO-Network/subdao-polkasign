import React, { useState } from 'react'

export const ContractItem: React.FC = () => {
  const [isActive, setActive] = useState(false)

  return (
      <div className="w-full rounded mb-4 custom-item-content">
        <div className="w-full flex justify-between items-center h-12 pl-4 pr-4" onClick={() => {
          setActive(!isActive)
        }}>
          <div className="text-secondary">I Invoice755105449.of </div>
          <div className=" text-default opacity-80">5:38 PM 2021/06/06 </div>
          <div className="text-default opacity-80">Waiting </div>
        </div>
        {
          isActive &&
          <div className="pl-4 pr-4 pb-4">
            <div className="flex border border-dashed pl-5 pr-5 pt-7 pb-7 bg-black custom-border-gray">
              <div className=" w-1/2">
                <div className="flex items-center text-sm mb-5">
                  Tx Hash：1dFa23rsdf1dFa23rsdf
                  <img src="/images/sign/copy.png" alt="Copy" className="inline-block w-4 h-4 ml-2" />
                </div>
                <div className="flex items-center w-full text-sm mb-5 truncate" style={{maxWidth: 332}}>
                  File Hash：OxasdPsd23OxasdPsd2323O...
                  <img src="/images/sign/copy.png" alt="Copy" className="inline-block w-4 h-4 ml-2" />
                </div>
                <div className="flex items-center text-sm mb-6">
                  Created：Jun62021-538PM
                </div>
                <div className="flex justify-center">
                  <div className="border border-brandPrimary text-secondary flex justify-center items-center w-20 h-8 rounded cursor-default">View</div>
                </div>
              </div>
              <div className=" w-1/2 text-sm">
                <div className="mb-4">Waiting</div>
                <div className="opacity-80 mb-3">5FCQ2wm6eSh5FCQ2wm6eSh5FCQ2wm6eSh</div>
                <div className="opacity-80 mb-5">5FCQ2wm6eSh5FCQ2wm6eSh5FCQ2wm6eS2wm6eSh...</div>
                <div className="mb-4">Waiting</div>
                <div className="opacity-80 mb-3">5FCQ2wm6eSh5FCQh</div>
                <div className="opacity-80 mb-5">5FCQ2wm6eSh5FCQ</div>
              </div>
            </div>
          </div>
        }

      </div>
  )
}
