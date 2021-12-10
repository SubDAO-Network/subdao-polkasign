import addresses from '../config/constants'
import { Address } from '../config/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 1
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getSignAddress = () => {
  return getAddress(addresses.sign)
}

