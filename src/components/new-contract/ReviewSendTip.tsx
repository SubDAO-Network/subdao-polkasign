import React, { useEffect, useState } from 'react'
import useAccountStore from '../../stores/useAccountStore'

export const ReviewSendTip: React.FC<any> = () => {
  const createStep = useAccountStore((state) => state.createStep)
  // const { step } =  props
  const [step, setStep] = useState(1)
  useEffect(() => {
    setStep(createStep)
  }, [createStep])
  return (
    <div className="w-full flex justify-center ">
      <div className="w-full max-w-4xl mb-24 flex flex-col overflow-hidden custom-pdf-signer custom-send-tip mt-4">
        <div className="w-full flex items-center font-semibold pl-4 relative custom-signer-title">
          Review and Send
        </div>
        <div className="p-5 custom-add-main">
          {
            step <= 2 &&
            <>
              <div className="text-md text-center mt-5 mb-7">
                Uploading the document …… (Please be patient)
              </div>
              <div className="flex justify-center items-center mb-8">
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`${step >= 2 ? 'custom-line active' : 'custom-line'}`}></div>
                <img src="/images/icons/contract_gray.png" className="w-8 h-8" alt="" />
                <div className={`custom-line`}></div>
                <img src="/images/icons/contract_gray.png" className="w-8 h-8" alt="" />
              </div>
            </>
          }
          {
            step === 3 &&
            <>
              <div className="text-md text-center mt-5 mb-7">
                File addresses are being stored on blockchain ……
              </div>
              <div className="flex justify-center items-center mb-8">
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`${step >= 2 ? 'custom-line active' : 'custom-line'}`}></div>
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`custom-line active`}></div>
                <img src="/images/icons/contract_gray.png" className="w-8 h-8" alt="" />
              </div>
            </>
          }
          {/* {
            step === 4 &&
            <>
              <div className="text-md text-center mt-5 mb-7">
                Adding signers and signing locations ……
              </div>
              <div className="flex justify-center items-center mb-8">
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`${'custom-line active'}`}></div>
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`custom-line active`}></div>
                <img src="/images/icons/contract_gray.png" className="w-8 h-8" alt="" />
              </div>
            </>
          } */}
          {
            step >= 4 &&
            <>
              <div className="text-md text-center mt-5 mb-7">
                Waiting for network confirmation ……
              </div>
              <div className="flex justify-center items-center mb-8">
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`${'custom-line active'}`}></div>
                <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                <div className={`custom-line active`}></div>
                {
                  step === 4 && <img src="/images/icons/contract_gray.png" className="w-8 h-8" alt="" />
                }
                {
                  step > 4 && <img src="/images/icons/contract_green.png" className="w-8 h-8" alt="" />
                }
              </div>
            </>
          }

        </div>
      </div>
    </div>
  )
}
