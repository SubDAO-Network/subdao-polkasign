import React, { useEffect, useState, useCallback } from 'react'
import { XIcon } from '@heroicons/react/solid'

export const ReviewSend: React.FC<any> = (props) => {
  const { nowItem } = props
  return (
    <div className="w-full flex flex-col overflow-hidden custom-pdf-signer">
      <div className="w-full flex items-center font-semibold pl-4 custom-signer-title">
        Review and Send
        <div className="absolute -right-3 -top-3.5 custom-modal-close">
          <button
            onClick={() => {
              props.close && props.close()
            }}
            className="p-1 text-white rounded-full inline-flex outline-none focus:outline-none custom-dialog-btn"
          >
            <span className="sr-only">Close</span>
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="">
        <div className="w-full flex items-center justify-between px-8 mt-2 custom-review-item">
          <div className="opacity-80">Uploaded documents:</div>
          <div className="">{nowItem.name}</div>
        </div>
        <div className="w-full flex items-center justify-between px-8 custom-review-item bg-gray">
          <div className="opacity-80">Creation date:  <span className="text-brandPrimary">Block creation</span></div>
          <div className="">{nowItem.newDate} </div>
        </div>
        <div className="w-full flex items-center justify-between px-8 custom-review-item">
          <div className="opacity-80">Document ID:</div>
          <div className="flex items-center">Ox558e...59c417 <img src="/images/icons/copy.png" className=" ml-1 w-5 h-5" alt="" /> </div>
        </div>
        <div className="w-full flex items-center justify-between px-8 custom-review-item bg-gray">
          <div className="opacity-80">Document storage ID:</div>
          <div className="flex items-center">Ox558e...59c417 <img src="/images/icons/copy.png" className=" ml-1 w-5 h-5" alt="" /> </div>
        </div>
        <div className="w-full flex items-center justify-between px-8 custom-review-item">
          <div className="opacity-80">Storage provider:</div>
          <div className="flex items-center">IPFS(Fleek) </div>
        </div>

      </div>

    </div>
  )
}
