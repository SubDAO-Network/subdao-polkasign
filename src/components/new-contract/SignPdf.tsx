import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Upload, message } from 'antd';

import { Button } from '../button';
import { ViewPdf } from './ViewPdf'
import useAccountStore from '../../stores/useAccountStore'
import useAppStore from '../../stores/useAppStore'
import { AddSigner } from '../add-signer';
import { ReviewSend } from './ReviewSend'
import useModal from '../../hooks/useModal'
import { ReviewSendTip } from './ReviewSendTip'
import { notify } from '../../stores/useNotificationStore'

const { Dragger } = Upload;

export const SignPdf: React.FC = () => {
  const appActions = useAppStore((s) => s.actions)
  const accountActions = useAccountStore((s) => s.actions)
  const nowAgreement = useAccountStore((s) => s.nowAgreement)
  const { set: setAppStore } = useAppStore((state) => state)
  const { set: setAccountStore } = useAccountStore((state) => state)

  const [ isLoading, setIsLoading] = useState(true)

  const [ nowState, setNowState ] = useState(0)

  const [step, setStep] = useState(1)
  const [onPresentConnectWallet, onDismiss] = useModal(<ReviewSendTip step={step} />)

  useEffect(() => {
    setNowState(1)
  }, [])

  const overSend = async function() {
    // 弹出进度窗口
    // 1. 先上传文件
    const signatureData = (document.querySelector('#iframe') as any).contentWindow.signatureList
    console.log(signatureData)
    if (!signatureData || signatureData.length <= 0) {
      notify({
        title: 'Please add a signature first'
      })
      return;
    }
    setAccountStore(state => {
      state.createStep = 2
    })
    let tmpFile = new Blob([JSON.stringify(signatureData)]) as any
    tmpFile.name = 'sign_info.txt'
    const { hash, publicUrl } = await appActions.fleekUpload(tmpFile)
    console.log(hash, publicUrl)
    setAccountStore(state => {
      state.createStep = 3
    })
    accountActions.attachResourceToAgreementWithSign('3', 'bafybeih2j3lljld2idmjviarnd3r4sj', publicUrl,
      result => {
        if (result.status.isInBlock) {
          console.log('in a block')
          setAccountStore(state => {
            state.createStep = 4
          })
        } else if (result.status.isFinalized) {
          console.log('isFinalized')
          setAccountStore(state => {
            state.createStep = 5
          })
          setTimeout(() => {
            onDismiss()
            setAppStore(state => {
              state.menuIndex = 1
            })
          }, 1000)
        } else {

        }
      }
    )
    return
    setAccountStore(state => {
      state.createStep = 3
    })
    setStep(4)
  }

  return (
    <div className="w-full flex flex-col ">
      {nowAgreement.agreementFile && <ViewPdf fileUrl={nowAgreement.agreementFile.url} />}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center h-20 bg-black border-t border-lightgray">
        <div className="custom-step flex ">
          <div className="custom-step-item flex items-center relative">
            {
              nowState < 3 ? <div className={classNames("step-num w-9 h-9 font-semibold flex justify-center items-center rounded-full bg-lightgray", {
                'active': nowState <= 2
              })}>1</div> :
              <img src="/images/icons/contract_green.png" className=" w-9 h-9" alt="" />
            }
            <div className={classNames('step-text', {
              'active': nowState <= 2,
              'text-green': nowState > 2
            })}>Sign</div>
            <div className="step-line"></div>
          </div>

          <div className="custom-step-item flex items-center relative">
            <div className={classNames("step-num w-9 h-9 font-semibold flex justify-center items-center rounded-full bg-lightgray", {
              'active': nowState === 4
            })}>3</div>
            <div className={classNames('step-text', {
              'active': nowState === 4,
              'text-green': nowState > 4
            })}>Send</div>
          </div>
        </div>
        <div className="flex ml-32 ">
          <Button variant="subtle" className="mr-6" onClick={() => {
              setAppStore(state => {
                state.menuIndex = 1
              })
            }}>Cancel</Button>
          <Button onClick={() => {

              // appActions.fleekUpload(file)
              overSend()
            }}>Send</Button>
        </div>
      </div>
    </div>
  )
}
