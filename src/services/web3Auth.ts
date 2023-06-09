import type { SafeEventEmitterProvider, UserAuthInfo } from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import type { Web3AuthOptions } from "@web3auth/modal";
import { Web3Auth } from "@web3auth/modal";

import { AuthMode, ChainId, Web3AuthNetwork } from "@/enums/web3Auth";

class Web3AuthService {
  protected defaultConfig: Web3AuthOptions;

  protected currentConfig: Web3AuthOptions;

  protected web3Auth: Web3Auth | null;

  constructor(clientId: string = "", chainId: string = ChainId.GOERLI) {
    this.defaultConfig = {
      clientId,
      web3AuthNetwork: Web3AuthNetwork.TESTNET,
      authMode: AuthMode.DAPP,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId,
        rpcTarget: process.env.NEXT_PUBLIC_RPC_URL,
      },
    };

    this.currentConfig = { ...this.defaultConfig };

    this.web3Auth = null;
  }

  useDefaults(config: Object) {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  setAuthMode(mode: AuthMode) {
    this.currentConfig.authMode = mode;
  }

  setChainConfig(chainConfig: any) {
    this.currentConfig.chainConfig = chainConfig;
  }

  setAuthNetwork(network: Web3AuthNetwork) {
    this.currentConfig.web3AuthNetwork = network;
  }

  setClientId(clientId: string) {
    this.currentConfig.clientId = clientId;
  }

  buildWeb3Auth(): Web3AuthService {
    const web3Auth = new Web3Auth(this.currentConfig);
    this.web3Auth = web3Auth;
    return this;
  }

  async getPrivateKey(): Promise<string> {
    if (this.checkInitializeWeb3Auth() === false) {
      throw new Error("Not build web3 auth yet");
    }
    return (this.web3Auth!.provider as SafeEventEmitterProvider).request({
      method: "private_key",
    }) as Promise<string>;
  }

  async authenticateUser(): Promise<UserAuthInfo> {
    if (this.checkInitializeWeb3Auth() === false) {
      throw new Error("Not build web3 auth yet");
    }
    return this.web3Auth!.authenticateUser();
  }

  async connect(): Promise<SafeEventEmitterProvider | null> {
    if (this.checkInitializeWeb3Auth() === false) {
      throw new Error("Not build web3 auth yet");
    }
    return this.web3Auth!.connect() as Promise<SafeEventEmitterProvider | null>;
  }

  async disconnect(): Promise<void> {
    if (this.checkInitializeWeb3Auth() === false) {
      throw new Error("Not build web3 auth yet");
    }
    await this.web3Auth!.logout();
  }

  async initialize(): Promise<void> {
    if (this.checkInitializeWeb3Auth() === false) {
      throw new Error("Not build web3 auth yet");
    }
    await this.web3Auth!.initModal();
  }

  private checkInitializeWeb3Auth(): boolean {
    return !(this.web3Auth === null);
  }
}

export default Web3AuthService;
