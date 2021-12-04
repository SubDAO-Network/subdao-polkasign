import React, { useEffect, useState } from 'react'
import useAccountStore from '../../stores/useAccountStore'

export const AddSigner: React.FC<any> = (props) => {
  const account = useAccountStore((state) => state.account)
  const [newSigners, setNewSigners] = useState([])

  useEffect(() => {
    props.getSingers && props.getSingers(newSigners)
  }, [newSigners])

  return (
    <div className="w-full flex justify-center ">
    <div className="w-full max-w-4xl mb-24 flex flex-col overflow-hidden custom-pdf-signer mt-5">
      <div className="w-full flex items-center font-semibold pl-4 relative custom-signer-title">
        Add Signer
      </div>
      <div className="p-5 custom-add-main">
        <div className="w-full flex items-center pl-5 mt-2 mb-5 custom-signer-item">
          <img src="/images/icons/me.png" className=" w-11 h-11" alt="" />
          <div className=" ml-3">
            <div className="font-semibold">Me</div>
            <div className=" opacity-80 mt-2">{account.address}</div>
          </div>
        </div>
        {
          newSigners.map((singer, index) => <div key={index} className="w-full flex items-center pl-5 mt-2 mb-5 relative custom-signer-item">
            <img onClick={() => {
              const tmpArr = [...newSigners]
              tmpArr.splice(index, 1)
              setNewSigners(tmpArr)
            }} src="/images/icons/del.png" className=" w-5 h-5 absolute right-0 top-0" alt="" />
            <img src="/images/icons/others.png" className=" w-11 h-11" alt="" />
            <div className=" ml-3">
              <div className="font-semibold">Adding a Participants Address</div>
              <input value={singer.address} onChange={(e) => {
                singer.address = e.target.value
                const tmpArr = [...newSigners]
                tmpArr[index].address = e.target.value
                setNewSigners(tmpArr)
              }} className="opacity-80 mt-2 bg-black h-9 px-4 leading-9 rounded-md w-96" style={{width: '30rem'}} placeholder="please fill the address to sign" />
            </div>
          </div>)
        }

      </div>
      <div className="flex justify-between items-center pb-6">
        <div className=" flex items-center pt-4 ml-7 cursor-default" onClick={() => {
          setNewSigners([...newSigners, {address: ''}])
        }}>
          <div className="flex mr-3 justify-center items-center w-8 h-8 bg-brandPrimary rounded-full">
            <img src="/images/icons/add-others.png" className=" w-4 h-4" alt="" />
          </div>
          Add a signer
        </div>
      </div>
      </div>
    </div>
  )
}
