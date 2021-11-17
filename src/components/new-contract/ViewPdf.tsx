import React, { useEffect, useState, useCallback } from 'react'
import useModal from '../../hooks/useModal'
import { AddSigner } from '../../components/add-signer';

export const ViewPdf: React.FC<any> = (props) => {
  const [onPresentConnectWallet, onDismiss] = useModal(<AddSigner />)

  return (
    <div className="w-full custom-view-pdf flex">
      {/* <canvas id="theCanvas"></canvas> */}
      <iframe id="iframe" className="custom-iframe flex-1" src={`/pdfviewer/web/viewer.html?file=${props.fileUrl}`}></iframe>
      {/* <iframe id="iframe" className="custom-iframe flex-1" src={`http://localhost:8888/web/viewer.html`}></iframe> */}
      <div className="flex flex-col custom-pdf-right">
        <div className="h-14 flex items-center pl-5 font-semibold border-b border-lightgray w-full">Add Signatures</div>
        <div className="flex flex-col items-center justify-center">
          <div className=" p-3">
            <div className="shadow p-4 w-full mb-4">
              <div className="text-md">Page 1</div>
              <div className=" text-base my-2">0x519...162</div>
              <div className=" text-sm opacity-60">9month27,00:28</div>
            </div>
            <div className="shadow p-2 w-full mb-4 border border-brandPrimary">
              <div className="text-md">Page 2</div>
              <div className=" text-base my-2">0x519...162</div>
              <div className=" text-sm opacity-60">9month27,00:28</div>
            </div>
            <div className="shadow p-2 w-full mb-4">
              <div className="text-md">Page 2</div>
              <div className=" text-base my-2">0x519...162</div>
              <div className=" text-sm opacity-60">9month27,00:28</div>
            </div>
          </div>
          <div className="flex justify-center items-center border border-brandPrimary rounded w-64 h-11 mt-4 cursor-pointer"
            onClick={() => {
              // onPresentConnectWallet()
              (document.querySelector('#iframe') as any).contentWindow.showSignature()
            }}
          >
            <img src="/images/icons/add.png" className=" w-5 h-5 mr-3" alt="" />
            My Signatures
          </div>
        </div>
      </div>
    </div>
  )
}
