import React, { useEffect, useState, useCallback } from 'react'
import moment from 'moment'
import useAccountStore from '../../stores/useAccountStore'
import useAppStore from '../../stores/useAppStore'

export const ViewPdf: React.FC<any> = (props) => {
  const actionsApp = useAppStore((s) => s.actions)
  const nowAgreement = useAccountStore((s) => s.nowAgreement)

  const [signatureList, setSignatureList] = useState([]);
  const [nowCount, setCount] = useState(1)
  const [nowSignture, setNowSignture] = useState(-1)

  useEffect(() => {
    console.log(nowAgreement)
    const getResourcesInfo = async () => {
      let newResources = []
      for(let k = 0; k < nowAgreement.resources.length; k++) {
        const item = nowAgreement.resources[k]
        const sourceKey = item.url.slice(item.url.lastIndexOf('/') + 1)
        const fileResult = await actionsApp.fleekGet(sourceKey)
        const signInfo = String.fromCharCode.apply(null, fileResult.data)
        newResources.push({
          ...item,
          ...(JSON.parse(signInfo)[0] as any)
        })
      }
      setSignatureList(newResources);
      console.log(newResources);
      (document.querySelector('#iframe') as any).contentWindow.haveSignedList = newResources
    }
    getResourcesInfo()
  }, [nowAgreement])

  useEffect(() => {
    (window as any).getSignatureList = function(e) {
      setSignatureList(e)
    }
    const timer = setInterval(() => {
      setCount(Date.now())

    }, 500)
    return () => {
      clearInterval(timer)
    }
  }, [])



  return (
    <div className="w-full custom-view-pdf flex">
      {/* <canvas id="theCanvas"></canvas> */}
      <iframe id="iframe" className="custom-iframe flex-1" src={`/pdfviewer/web/viewer.html?file=${props.fileUrl}`}></iframe>
      {/* <iframe id="iframe" className="custom-iframe flex-1" src={`http://localhost:8888/web/viewer.html`}></iframe> */}
      <div className="flex flex-col custom-pdf-right">
        <div className="h-14 flex items-center pl-5 font-semibold border-b border-lightgray w-full" style={{padding: '16px 20px'}}>Add Signatures <div style={{width: '0px', height: '0px', overflow: 'hidden'}}>{nowCount}</div></div>
        <div className="flex flex-col items-center justify-center">
          {
            !nowAgreement.meSigned && <div className="flex justify-center items-center border border-brandPrimary rounded w-64 h-11 mt-4 cursor-pointer"
              onClick={() => {
                (document.querySelector('#iframe') as any).contentWindow.showSignature()
              }}
            >
              <img src="/images/icons/add.png" className=" w-5 h-5 mr-3" alt="" />
              My Signatures
            </div>
          }

          <div className=" p-5 w-full">
            {
              signatureList.map((item, index) =>
              <div key={index} className={`p-4 w-full mb-4 rounded-md border cursor-pointer custom-signture-item ${nowSignture === index ? 'active': ''}`}
                onClick={() => {
                  setNowSignture(index);
                  if((document.querySelector('#iframe') as any).contentWindow.gotoPageFrom) {
                    (document.querySelector('#iframe') as any).contentWindow.gotoPageFrom(item.page)
                  }
                }}
              >
                <div className="text-md">Page {item.page}</div>
                {
                  item.creator && <div className=" text-base my-2">{item.creator.slice(0, 8) + '...' + item.creator.slice(36)}</div>
                }

                <div className=" text-sm opacity-60">{moment.unix(item.saveAt * 1).format('h:mm a YYYY/MM/DD')}</div>
              </div>)
            }
          </div>

        </div>
      </div>
    </div>
  )
}
