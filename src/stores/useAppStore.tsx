import create, { SetState, State } from 'zustand'
import BigNumber from 'bignumber.js'
import produce from 'immer'
import fleek from '@fleekhq/fleek-storage-js'

const apiKey = 'uhKPc/tefUA71vousPQbMg=='
const apiSecret = 'XVmbQ6R2YwYthh3UmR+d6Tkjglsl71tmcqI0fQ8NGNo='

interface AppStoreActions {
  fleekUpload: (file: File) => Promise<any>,
  fleekGet: (fileName: string) => Promise<any>
}

interface AppStore extends State {
  menuIndex: number,
  isQueue: number,
  freshCount: number,
  pageInfo: {page: number, pageSize: number},
  set: SetState<AppStore>,
  actions: AppStoreActions
}


const useAppStore = create<AppStore>((set, get) => ({
  menuIndex: 1,
  isQueue: 0,
  freshCount: 0,
  pageInfo: {
    page: 0,
    pageSize: 5
  },
  set: (fn: (s: AppStore) => AppStore) => set(produce(fn)),
  actions: {
    async fleekUpload(file) {
      console.log(file)
      const input = {
        apiKey,
        apiSecret,
        key: 'polkasign/' + file.name,
        data: file
      }
      const result = await fleek.upload(input);
      return result;
    },
    async fleekGet(fileName) {
      const input = {
        apiKey,
        apiSecret,
        key: 'polkasign/' + fileName,
        getOptions: ['hash', 'data', 'publicUrl', 'key']
      }
      const result = await fleek.get(input);
      return result
    }
  }
}))

export default useAppStore
