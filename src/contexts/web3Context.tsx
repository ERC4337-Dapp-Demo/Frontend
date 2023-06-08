import React, { useState, useEffect, createContext } from "react";
import Web3AuthService from "@/services/web3Auth";
import UserOperationService from "@/services/userOperation";
import { Presets } from "userop";
import { ethers } from "ethers";

export interface Web3ContextType {
  web3AuthService: Web3AuthService | null;
  useropService: UserOperationService | null;
  setUseropService: React.Dispatch<
    React.SetStateAction<UserOperationService | null>
  >;
  account: Presets.Builder.SimpleAccount | null;
  setAccount: React.Dispatch<
    React.SetStateAction<Presets.Builder.SimpleAccount | null>
  >;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export { Web3Context };
