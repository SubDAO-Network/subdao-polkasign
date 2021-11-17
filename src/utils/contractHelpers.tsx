import { ContractPromise } from '@polkadot/api-contract';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

// Addresses
import {
  getSignAddress
} from './addressHelpers'


import polkasignAbi from '../config/abi/polkasign.json'

export const getApi = async () => {
  const ws_endpoint = 'ws://43.133.174.232:9944';
  const provider = new WsProvider(ws_endpoint);
  const api = await ApiPromise.create({
    provider: provider,
    types: {
        "Address": "MultiAddress",
        "LookupSource": "MultiAddress"
    }
  });
  return api
}

export const getPolkasignContract = async () => {
  const api = await getApi()
  return new ContractPromise(api, polkasignAbi, getSignAddress());
}


export const isValidAddressPolkadotAddress = (address) => {
  try {
    encodeAddress(
      isHex(address)
        ? hexToU8a(address)
        : decodeAddress(address)
    );

    return true;
  } catch (error) {
    return false;
  }
};



