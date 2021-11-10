/// <reference types="react-scripts" />

declare module 'jazzicon' {
  export default function(diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

declare var URL: {
  prototype: URL;
  new(url: string | URL, base?: string | URL): URL;
  createObjectURL(object: any): string;
  revokeObjectURL(url: string): void;
};

interface window {
  ethereum?: {
    [key: string]: any
  }
  web3?: any
  matchMedia?: {
    [key: string]: any
  }
  pdfjsLib?: {
    [key: string]: any
  }
}
interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void,
    chainId?: string
  }
}
