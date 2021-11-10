import React, { useEffect, useState, useCallback } from 'react'

export const NoData: React.FC = () => {
  return (
    <div className="flex w-full flex-col justify-center items-center">
      <img src="/images/sign/nodata.png" alt="No Data" className="w-52 mt-40" />
      <div className="text-secondary opacity-60 mt-5">Temporarily no data</div>
    </div>
  )
}
