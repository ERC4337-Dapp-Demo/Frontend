import { createContext } from "react";
import Web3AuthService from "@/services/web3Auth";
import UserOperationService from "@/services/userOperation";
import { Presets } from "userop";
import ExecutionOpService from "@/services/executionOp";

export interface Web3StoreInterface {
  web3AuthService: Web3AuthService;
  userOpService: UserOperationService;
  executionOpService: ExecutionOpService;
  account: Presets.Builder.SimpleAccount;
}

export interface Web3ContextType {
  store: Web3StoreInterface | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export { Web3Context };
