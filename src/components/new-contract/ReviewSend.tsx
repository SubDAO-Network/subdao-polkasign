import React, { useEffect, useState, useCallback } from 'react'
import useAccountStore from '../../stores/useAccountStore'

export const ReviewSend: React.FC<any> = (props) => {
  const { fileInfo, nowSigners } =  props
  const account = useAccountStore((state) => state.account)

  return (
    <div className="w-full flex justify-center ">
      <div className="w-full max-w-4xl mb-24 flex flex-col overflow-hidden custom-pdf-signer mt-4">
        <div className="w-full flex items-center font-semibold pl-4 relative custom-signer-title">
          Review and Send
        </div>
        <div className="p-5 custom-add-main">
          <div className=" mt-4 mb-4 font-semibold">Uploaded Document</div>
          <div className="border rounded-2xl border-gray bg-lightgray flex items-center custom-doc-list"
            >
            <div className="custom-pdf-wrap">
              <img src="/images/icons/pdf.png" alt="" />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <div className="text-default font-semibold">{fileInfo.name}</div>
            </div>
          </div>
          <div className="mb-4 mt-7 font-semibold">Singers</div>
          <div className="w-full flex items-center pl-5 mt-2 mb-5 custom-signer-item">
            <img src="/images/icons/me.png" className=" w-11 h-11" alt="" />
            <div className=" ml-3">
              <div className="font-semibold">Me</div>
              <div className=" opacity-80 mt-2">{account.address}</div>
            </div>
          </div>
          {
            nowSigners.map((singer, index) => <div key={index} className="w-full flex items-center pl-5 mt-2 mb-5 relative custom-signer-item">
              <img src="/images/icons/others.png" className=" w-11 h-11" alt="" />
              <div className=" ml-3">
                <div className="font-semibold">Participants Address</div>
                <div className="opacity-80 mt-2">
                  {singer.address}
                </div>
              </div>
            </div>)
          }

        </div>
      </div>
    </div>
  )
}
