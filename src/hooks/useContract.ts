import { useMemo } from 'react'
import {
  getPolkasignContract
} from '../utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const usePolkasignContract = () => {
  return getPolkasignContract()
}

