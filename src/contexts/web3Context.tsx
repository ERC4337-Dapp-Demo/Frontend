import { createContext } from 'react'
import type { Presets } from 'userop'

import type ExecutionOpService from '@/services/executionOp'
import type UserOperationService from '@/services/userOperation'
import type Web3AuthService from '@/services/web3Auth'

export interface Web3StoreInterface {
  web3AuthService: Web3AuthService
  userOpService: UserOperationService
  executionOpService: ExecutionOpService
  account: Presets.Builder.SimpleAccount
}

export interface Web3ContextType {
  store: Web3StoreInterface | null
}

const Web3Context = createContext<Web3ContextType | null>(null)

export { Web3Context }
