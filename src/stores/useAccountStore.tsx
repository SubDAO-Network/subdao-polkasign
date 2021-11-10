import create, { SetState, State } from 'zustand'
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Keyring, ApiPromise } from '@polkadot/api';
import { stringToU8a, stringToHex } from '@polkadot/util';
import produce from 'immer'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { usePolkasignContract } from '../hooks/useContract'
import { getApi } from '../utils/contractHelpers'

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
  fetchContracts: (page: number, pageSize: number) => Promise<void>,
  fetchContractsMy: (page: number, pageSize: number) => Promise<void>,
  createAgreement: (name: string, signers: Array<any>, hash: string, url: string, callback: any) => Promise<any>,
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
  set: (fn: (s: AccountStore) => AccountStore) => set(produce(fn)),
  actions: {
    async accountInit(injectedWeb3) {
      const { set } = get()
      set(state => {
        state.injectedWeb3 = injectedWeb3
      })
      const allInjected = await injectedWeb3.web3Enable('PolkaSign');
      const allAccounts = await injectedWeb3.web3Accounts();
      console.log(allAccounts)

      if (allAccounts.length > 0) {
        set(state => {
          state.accounts = allAccounts
          state.account = allAccounts[0]
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
    async fetchContracts(page, pageSize) {
      const { account, set } = get()
      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const { gasConsumed, result, output } = await polkasignContract.query.queryAgreementByCollaborator(
        account.address,
        { value, gasLimit },
        account.address,
        {pageIndex: page - 1, pageSize: pageSize},
        );
      if (result.isOk) {
        const outputData = output.toHuman() as any
        set((state) => {
          state.contractListTotal = outputData.total
          state.contractsList = outputData.data.reverse().map(item => {
            return {
              ...item,
              newDate: formatTime(item.createAt).format('h:mm a YYYY/MM/DD'),
              status: item.status * 1
            }
          })
        })
      } else {
        console.error('Error', result.asErr);
      }
    },
    async fetchContractsMy(page, pageSize) {
      const { account, set } = get()
      const polkasignContract = await usePolkasignContract()
      const value = 0; // only useful on isPayable messages
      const gasLimit = -1;
      const { gasConsumed, result, output } = await polkasignContract.query.queryAgreementByCreator(
        account.address,
        { value, gasLimit },
        account.address,
        {pageIndex: page - 1, pageSize: pageSize},
        );
      if (result.isOk) {
        const outputData = output.toHuman() as any
        set((state) => {
          state.contractMyTotal = outputData.total
          state.contractsMyList = outputData.data.reverse().map((item, key) => {
            return {
              ...item,
              newDate: formatTime(item.createAt).format('h:mm a YYYY/MM/DD'),
              status: item.status * 1,
              signtory: item.signs[account.address],
              key: key,
              founder: 'Me'
            }
          })
        })
      } else {
        console.error('Error', result.asErr);
      }
    },
    async createAgreement(name, signers, hash, url, callback) {
      const { account, accounts, injectedWeb3, allInjected, set } = get()

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
      return new Promise(resolve => {
        polkasignContract.tx
          .createAgreement({ value, gasLimit },  {
            name: name,
            signers: [account.address, ...signers],
            agreementFile: {
              hash_: hash,
              creator: account.address,
              usage: 'createAgreement',
              saveAt: Date.now() / 1000,
              url: url
            }
          })
          .signAndSend(account.address, { signer: injector.signer }, (result) => {
            callback(result)

          });
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
