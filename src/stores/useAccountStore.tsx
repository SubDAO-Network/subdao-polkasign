import create, { SetState, State } from 'zustand'
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring, ApiPromise } from '@polkadot/api';
import { stringToU8a, stringToHex } from '@polkadot/util';
import produce from 'immer'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { usePolkasignContract } from '../hooks/useContract'
import { getApi } from '../utils/contractHelpers'
import { client, clientMy } from '../apollo/client';
import { GET_CONTRACTS_LIST, GET_CONTRACTS_LIST_MY } from '../apollo/queries';

const formatTime = (timeStamp) => {
  const tmp = timeStamp.split(',').join('') / 1000
  return moment.unix(tmp)
}

export interface Account {
  address?: string,
  type?: string,
  meta?: {genesisHash: string, name: string, source: string}
}
interface AccountStoreActions {
  accountInit: (injectedWeb3) => Promise<void>,
  changeAccount: (address: string) => Promise<void>,
  fetchContracts: (creator: string, signer: string, status: string, page: number, size: number, order: string) => Promise<void>,
  fetchContractsMy: (creator: string, signer: string, status: string, page: number, size: number, order: string) => Promise<void>,
  createAgreement: (name: string, signers: Array<any>, hash: string, url: string, callback: any) => Promise<any>,
  createAgreementWithsign: (name: string, signers: Array<any>, hash: string, url: string, hash2: string, url2: string, callback: any) => Promise<any>,
  attachResourceToAgreement: (index: string, hash: string, url: string, callback: any) => Promise<any>,
  attachResourceToAgreementWithSign: (index: string, hash: string, url: string, callback: any) => Promise<any>,
  fetchBlanceOf: (address: string) => Promise<void>,
  fetchIdoClaimed: (account: string) => Promise<void>,
}

interface AccountStore extends State {
  injectedWeb3,
  allInjected: Array<any>,
  accounts: Array<Account>,
  account: Account,
  balanceOfSDT: BigNumber,
  contractsList: Array<any>,
  contractsMyList: Array<any>,
  singers: Array<any>,
  createStep: number,
  contractListTotal: number,
  contractMyTotal: number,
  nowAgreement: any,
  set: SetState<AccountStore>,
  actions: AccountStoreActions
}

const useAccountStore = create<AccountStore>((set, get) => ({
  injectedWeb3: null,
  allInjected: [],
  accounts: [],
  account: {
    address: ''
  },
  balanceOfSDT: new BigNumber(0),
  contractsList: [],
  contractsMyList: [],
  singers: [],
  createStep: 1,
  contractListTotal: 0,
  contractMyTotal: 0,
  nowAgreement: {},
  set: (fn: (s: AccountStore) => AccountStore) => set(produce(fn)),
  actions: {
    async accountInit(injectedWeb3) {
      const { account, set } = get()
      set(state => {
        state.injectedWeb3 = injectedWeb3
      })
      const allInjected = await injectedWeb3.web3Enable('PolkaSign');
      const allAccounts = await injectedWeb3.web3Accounts();
      console.log(allAccounts)

      if (allAccounts.length > 0) {
        set(state => {
          state.accounts = allAccounts
          state.account = account.address ? account : allAccounts[0]
          state.allInjected = allInjected
        })
      }
    },
    async changeAccount(address) {
      const { accounts, set } = get()
      const find = accounts.find(item => item.address === address)
      set(state => {
        state.account = find
      })
      this.fetchBlanceOf(find.address)
    },
    async fetchContracts(creator = '', signer = '', status = "[2,1,0]", page = 0, size = 5, order = 'desc', clear?) {
      const { account, set } = get()
      const res = await client.query({
        query: GET_CONTRACTS_LIST(creator, signer, status, page, size, order),
        fetchPolicy: "network-only"
      })
      if (res.data && res.data.agreementInfos) {
        const agreementInfos = res.data.agreementInfos
        set((state) => {
          if (page === 0) {
            state.contractListTotal = agreementInfos.total
          }
          const agreementInfosData = agreementInfos.data.map(item => {
            return {
              ...item,
              agreement_file: JSON.parse(item.agreement_file),
              resources: JSON.parse(item.resources),
              sign_infos: JSON.parse(item.sign_infos),
              signers: item.signers.split(','),
            }
          })
          state.contractsList = agreementInfosData.map(item => {
            let waitSignInfos = []
            let finishedSignInfos = []
            item.signers.forEach(signer => {
              if (!item.sign_infos.find(signInfo => signInfo.addr === signer)) {
                waitSignInfos.push(signer)
              } else {
                finishedSignInfos.push(signer)
              }
            })
            return {
              ...item,
              newDate: formatTime(item.create_at).format('h:mm a YYYY/MM/DD'),
              status: item.status * 1,
              meSigned: item.sign_infos.find(item => item.addr === account.address),
              waitSignInfos,
              finishedSignInfos
            }
          })
        })
      }
    },
    async fetchContractsMy(creator = '', signer = '', status = "[2,1,0]", page = 0, size = 5, order = 'desc') {
      const { account, set } = get()
      const res = await clientMy.query({
        query: GET_CONTRACTS_LIST_MY(creator, signer, status, page, size, order),
      })
      if (res.data && res.data.agreementInfos) {
        const agreementInfos = res.data.agreementInfos
        set((state) => {
          state.contractMyTotal = agreementInfos.total
          const agreementInfosData = agreementInfos.data.map(item => {
            return {
              ...item,
              agreement_file: JSON.parse(item.agreement_file),
              resources: JSON.parse(item.resources),
              sign_infos: JSON.parse(item.sign_infos),
              signers: item.signers.split(','),
            }
          })
          state.contractsMyList = agreementInfosData.map((item, key) => {
            return {
              ...item,
              newDate: formatTime(item.create_at).format('h:mm a YYYY/MM/DD'),
              status: item.status,
              signtory: item.sign_infos.find(item => item.addr === account.address),
              key: key,
              founder: 'Me'
            }
          })
        })
      }
    },
    async createAgreement(name, signers, hash, url, callback) {
      const { balanceOfSDT, account, accounts, injectedWeb3, allInjected, set } = get()

      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const injector = await injectedWeb3.web3FromAddress(account.address);
      // const signRaw = injector?.signer?.signRaw;
      // const { signature } = await signRaw({
      //   address: account.address,
      //   data: stringToHex('this is our message'),
      //   type: 'bytes'
      // });
      // console.log(signature)
      // String.fromCharCode.apply(null, [])

      return new Promise(async resolve => {
        try {
          const tx = polkasignContract.tx
            .createAgreement({ value, gasLimit },  {
              name: name,
              signers: [account.address, ...signers],
              agreementFile: {
                hash: hash,
                creator: account.address,
                usage: 'createAgreement',
                saveAt: Date.now() / 1000,
                url: url
              }
            })
          const info = await tx.paymentInfo(account.address)
          if(new BigNumber(balanceOfSDT).gt(new BigNumber(info.partialFee.toString()).div(new BigNumber(Math.pow(10, 12))))) {
            tx.signAndSend(account.address, { signer: injector.signer }, (result) => {
              callback(null, result)
            });
          } else {
            callback('Fee is not enough')
          }

        } catch(err) {
          console.log(err)
        }

      })
    },
    async createAgreementWithsign(name, signers, hash, url, hash2, url2, callback) {
      const { balanceOfSDT, account, accounts, injectedWeb3, allInjected, set } = get()

      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const injector = await injectedWeb3.web3FromAddress(account.address);
      const signRaw = injector?.signer?.signRaw;
      const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(hash),
        type: 'bytes'
      });

      console.log('hash: ', hash)
      console.log('url: ', url)
      console.log('hash2: ', hash2)
      console.log('url2: ', url2)
      console.log('signature: ', signature)
      return new Promise(async resolve => {
        try {
          const tx = polkasignContract.tx
            .createAgreementWithSign({ value, gasLimit },  {
              name: name,
              signers: [account.address, ...signers],
              agreementFile: {
                hash: hash,
                creator: account.address,
                usage: 'createAgreement',
                saveAt: Date.now() / 1000,
                url: url
              },
            }, {
              hash: hash2,
              creator: account.address,
              usage: 'sign',
              saveAt: Date.now() / 1000,
              url: url2
            }, signature)
          const info = await tx.paymentInfo(account.address)
          if(new BigNumber(balanceOfSDT).gt(new BigNumber(info.partialFee.toString()).div(new BigNumber(Math.pow(10, 12))))) {
            tx.signAndSend(account.address, { signer: injector.signer }, (result) => {
              callback(null, result)
            });
          } else {
            callback('Fee is not enough')
          }

        } catch(err) {
          console.log(err)
        }

      })
    },
    async attachResourceToAgreement(index, hash, url, callback) {
      const { account, injectedWeb3 } = get()
      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const injector = await injectedWeb3.web3FromAddress(account.address);
      console.log(index, hash, url, account.address, Date.now() / 1000)
      return;
      return new Promise(resolve => {
        polkasignContract.tx
          .attachResourceToAgreement({ value, gasLimit }, index, {
            hash: hash,
            creator: account.address,
            usage: 'sign',
            saveAt: Date.now() / 1000,
            url: url
          })
          .signAndSend(account.address, { signer: injector.signer }, (result) => {
            callback(result)
          });
      })
    },
    async attachResourceToAgreementWithSign(index, hash, url, callback) {
      const { account, balanceOfSDT, injectedWeb3 } = get()
      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const injector = await injectedWeb3.web3FromAddress(account.address);
      const signRaw = injector?.signer?.signRaw;
      const { signature } = await signRaw({
        address: account.address,
        data: stringToHex(hash),
        type: 'bytes'
      });

      return new Promise(async resolve => {
        const tx = polkasignContract.tx
          .attachResourceWithSign({ value, gasLimit }, index, {
            hash: hash,
            creator: account.address,
            usage: 'sign',
            saveAt: Math.floor(Date.now() / 1000),
            url: url
          }, signature)
        const info = await tx.paymentInfo(account.address)
        if(new BigNumber(balanceOfSDT).gt(new BigNumber(info.partialFee.toString()).div(new BigNumber(Math.pow(10, 12))))) {
          tx.signAndSend(account.address, { signer: injector.signer }, (result) => {
            callback(null, result)
          });
        } else {
          callback('Fee is not enough')
        }
      })
    },
    async fetchIdoClaimed(account) {

    },
    async fetchBlanceOf(address) {
      const { set } = get()
      const api = await getApi();
      // let { data: balance, nonce: previousNonce } = await api.query.system.account(address);
      let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(address);
      set(state => {
        state.balanceOfSDT = new BigNumber(previousFree.toString()).div(new BigNumber(Math.pow(10, 12)))
      })
      console.log(`${address} has a balance of ${previousFree}, nonce ${previousNonce}`);
    }
  }
}))

export default useAccountStore
