import React from 'react'

export const Logo: React.FC = () => {
  return (
    <>
      <div className="select-none lg:block">
        <img
          src="/images/sign/logo.png"
          alt="Parrot"
          height="40"
          className="h-10"
        />
      </div>
      {/* <div className="select-none md:block lg:hidden">
        <img
          src="/icons/parrot-logo-d.svg"
          alt="Parrot"
          width="110"
        />
      </div> */}
    </>
  )
}
