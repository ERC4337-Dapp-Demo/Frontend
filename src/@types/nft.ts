import ExecutionOpService from "@/services/executionOp";
import { NftItemState } from "../enums/nft";
import UserOperationService from "@/services/userOperation";
import { EvmAddress } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";

export interface NFTDataItem {
  image: string | null;
  name: string;
  amount: string;
  tokenAddress: EvmAddress;
  tokenId: string | number;
  contractType: string;
  owner: string | undefined;
  price?: ethers.BigNumberish;
  marketId?: string;
}

export interface NFTItem {
  item: any;
  state: NftItemState;
  isOwned: boolean;
  execution: ExecutionOpService;
  userOperation: UserOperationService;
}
