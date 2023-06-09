import { ChainId } from "@/enums/web3Auth";

type ContractAddressType = {
  [key: string]: {
    entryPoint: string;
    accountFactory: string;
  };
};

export const ContractAddress: ContractAddressType = {
  [ChainId.GOERLI]: {
    entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    accountFactory: "0x9406Cc6185a346906296840746125a0E44976454",
  },
};
