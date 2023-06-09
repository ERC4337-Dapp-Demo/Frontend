import type { EvmAddress } from '@moralisweb3/common-evm-utils'
import type { ethers } from 'ethers'

import type ExecutionOpService from '@/services/executionOp'
import type UserOperationService from '@/services/userOperation'

import type { NftItemState } from '../enums/nft'

export interface NFTDataItem {
  image: string | null
  name: string
  amount: string
  tokenAddress: EvmAddress
  tokenId: string | number
  contractType: string
  owner: string | undefined
  price?: ethers.BigNumberish
  marketId?: string
}

export interface NFTItem {
  item: any
  state: NftItemState
  isOwned: boolean
  execution: ExecutionOpService
  userOperation: UserOperationService
}
