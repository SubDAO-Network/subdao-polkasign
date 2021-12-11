import { Upload } from 'antd';
import { Button } from '../../components/button';
import { ViewPdf } from './ViewPdf'
import useAccountStore from '../../stores/useAccountStore'
import useAppStore from '../../stores/useAppStore'
import { AddSigner } from '../../components/add-signer';
import { ReviewSend } from './ReviewSend'
import useModal from '../../hooks/useModal'
import { ReviewSendTip } from './ReviewSendTip'
import { notify } from '../../stores/useNotificationStore';
import { isValidAddressPolkadotAddress } from '../../utils/contractHelpers'
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { client } from '../../apollo/client';

const { Dragger } = Upload;

export const NewContract: React.FC = () => {
  const appActions = useAppStore((s) => s.actions)
  const accountActions = useAccountStore((s) => s.actions)
  const account = useAccountStore((s) => s.account)
  const { set: setAppStore } = useAppStore((state) => state)
  const { set: setAccountStore } = useAccountStore((state) => state)

  const [ nowState, setNowState ] = useState(0)
  const [ fileUrl, setFileUrl ] = useState('')
  const [ fileInfo, setFileInfo ] = useState({name: ''})
  const [ file, setFile ] = useState(null)
  const [ nowSigners, setNowSigners ] = useState([])
  const [ step, setStep ] = useState(1)
  const [onPresentConnectWallet, onDismiss] = useModal(<ReviewSendTip step={step} />)
  const [ signatureData, setSignatureData ] = useState([])

  const props = {
    showUploadList: false,
    customRequest: function() {
      return false
    },
    name: 'file',
    multiple: true,
    action: '',
    beforeUpload: file => {
      console.log(file)
      /* eslint-disable */
      let url = window.URL.createObjectURL(file); // @ts-ignore
      console.log(url)
      setFileUrl(url)
      setFileInfo({name: file.name})
      setFile(file)
      // setNowState(2)
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  };
  useEffect(() => {
    setNowState(1)
  }, [])

  const overSend = async function() {
    // 弹出进度窗口
    onPresentConnectWallet()
    // 1. 先上传文件
    setAccountStore(state => {
      state.createStep = 2
    })

    // const { hash, publicUrl } = await appActions.fleekUpload(new Blob(['abcdefg']) as File)
    // let tmpFile = new Blob([JSON.stringify({top: 100, left: 100, content: 'abcd'})]) as any
    // tmpFile.name = 'abc.txt'
    const { hash, publicUrl } = await appActions.fleekUpload(file)
    console.log('new hash: ', hash)
    if(signatureData.length > 0) {
      const tmpFile = new Blob([JSON.stringify(signatureData)]) as any
      tmpFile.name = `sign_info_${Date.now()}.txt`
      const { hash: hash2, publicUrl: publicUrl2 } = await appActions.fleekUpload(tmpFile)
      setAccountStore(state => {
        state.createStep = 3
      })
      // 2.
      try {
        const res = await accountActions.createAgreementWithsign(fileInfo.name, nowSigners.map(signer => signer.address), hash.slice(0,32), publicUrl, hash2, publicUrl2,
          (err, result) => {
            if(err) {
              notify({
                title: err,
              })
              onDismiss()
              return;
            }
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
                accountActions.fetchContracts('', account.address, "[1,0]", 0, 5, 'desc')
              }, 1000)
            } else {

            }
          }
        )
      } catch(err) {
        console.log(err)
      }
      setStep(4)
      return;
    }
    setAccountStore(state => {
      state.createStep = 3
    })
    // 2.
    try {
      const res = await accountActions.createAgreement(fileInfo.name, nowSigners.map(signer => signer.address), hash, publicUrl,
        (err, result) => {
          if(err) {
            notify({
              title: err,
            })
            onDismiss()
            return;
          }
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
              accountActions.fetchContracts('', account.address, "[1,0]", 0, 5, 'desc')
            }, 1000)
          } else {

          }
        }
      )
    } catch(err) {
      console.log(err)
    }
    setStep(4)
  }

  return (
    <div className="w-full flex flex-col ">
      {nowState === 1 && <div className="box-border pb-4 w-full flex justify-center">
        <div className="rounded-2xl custom-shadow2 custom-upload-wrap mt-5">
          <div className="flex items-center h-16 font-semibold pl-5 border-b custom-border-color2">New Contract</div>
          <div className="rounded-b-2xl pl-5 pr-5 pt-10 pb-10 bg-black flex flex-col">
            <div className="flex flex-col justify-center items-center custom-upload-content">
              <Dragger {...props}>
                <div className="flex flex-col justify-center items-center">
                  <img src="/images/icons/upload.png" className=" w-12 h-12 mb-4" alt="" />
                  <div className="text-brandPrimary mb-4">Drop a PDF contract file here</div>
                  <Button className="text-black font-normal">Upload</Button>
                </div>
              </Dragger>

            </div>
            { fileInfo.name &&
              <>
                <div className="mt-7 mb-5">Uploaded Documents</div>
                <div className="border rounded-2xl border-gray bg-lightgray flex items-center custom-doc-list"
                  onClick={() => {
                    setNowState(2)
                  }}
                >
                  <div className="custom-pdf-wrap">
                    <img src="/images/icons/pdf.png" alt="" />
                  </div>
                  <div className="flex flex-col justify-center ml-4">
                    <div className="text-default font-semibold">{fileInfo.name}</div>
                    {/* <div className="text-gray">1page</div> */}
                  </div>
                </div>
              </>
            }
          </div>
        </div>
      </div>
      }
      {
        nowState === 2 && <AddSigner getSingers={(newSigners) => {
          setNowSigners(newSigners)
        }} />
      }
      {
        nowState === 3 && <ViewPdf fileUrl={fileUrl} />
      }
      {
        nowState === 4 && <ReviewSend fileInfo={fileInfo} nowSigners={nowSigners} />
      }
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
            })}>Create</div>
            <div className="step-line"></div>
          </div>
          <div className="custom-step-item flex items-center relative">
            {
              nowState < 4 ? <div className={classNames("step-num w-9 h-9 font-semibold flex justify-center items-center rounded-full bg-lightgray", {
                'active': nowState === 3
              })}>2</div> :
              <img src="/images/icons/contract_green.png" className=" w-9 h-9" alt="" />
            }
            <div className={classNames('step-text', {
              'active': nowState === 3,
              'text-green': nowState > 3
            })}>Prepare Documents</div>
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
          {
            nowState === 1 && <Button variant="subtle" className="mr-6" onClick={() => {
              setAppStore(state => {
                state.menuIndex = 1
              })
            }}>Cancel</Button>
          }
          {
            nowState > 1 && <Button variant="subtle" className="mr-6" onClick={() => {
              setNowState(nowState - 1)
            }}>Back</Button>
          }
          {
            nowState === 1 && <Button onClick={() => {
              setNowState(2)

            }}>Next</Button>
          }
          {
            nowState === 2 && <Button onClick={() => {
              // 这里判断最近添加的一个签名人地址是否合法，不合法给提示，不让通过
              // if(nowSigners[nowSigners.length - 1] && !isValidAddressPolkadotAddress(nowSigners[nowSigners.length - 1].address)) {
              //   notify({
              //     title: 'Address is not valid!'
              //   })
              //   return
              // }
              const notValid = nowSigners.filter(item => !isValidAddressPolkadotAddress(item.address))
              if (notValid.length > 0) {
                notify({
                  title: 'Address is not valid!'
                })
                return
              }
              setNowState(3)
            }}>Next</Button>
          }
          {
            nowState === 3 && <Button onClick={() => {
              const signatureData = (document.querySelector('#iframe') as any).contentWindow.signatureList
              console.log(signatureData)
              if(signatureData && setSignatureData.length > 0) {
                setSignatureData(signatureData)
              }
              setNowState(4)
            }}>Review</Button>
          }
          {
            nowState === 4 && <Button onClick={() => {
              // appActions.fleekUpload(file)
              overSend()
            }}>Send</Button>
          }
        </div>
      </div>
    </div>
  )
}
