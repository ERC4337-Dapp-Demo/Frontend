import { ChainId } from '@/enums/web3Auth';

type ContractAddressType = {
  [key: string]: {
    marketplace: string;
    currency: string;
  };
};

export const ContractAddress: ContractAddressType = {
  [ChainId.GOERLI]: {
    marketplace: '0x06c74Bc76bc5176B5e1D6295dc2fc7fB2fA298D0',
    currency: '0x0b0cA8f3E5ca785938F4cFBD1C419BBa24bF521d',
  },
};
