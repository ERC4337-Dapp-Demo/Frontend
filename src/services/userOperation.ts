import { ethers } from 'ethers'
import { Presets } from 'userop'

import { ContractAddress } from '@/configs/addressOp'
import { ChainId } from '@/enums/web3Auth'

class UserOperationService {
  public chainId: string

  protected privateKey: string

  protected paymasterUrl: string

  protected paymaster: any

  protected account: Presets.Builder.SimpleAccount | null

  protected provider: ethers.providers.JsonRpcProvider

  protected signer: ethers.Wallet

  public rpcUrl: string

  public entryPoint: string = ''

  public accountFactory: string = ''

  constructor(
    privateKey: string,
    rpcUrl: string = process.env.NEXT_PUBLIC_RPC_URL as string,
    paymasterUrl: string = process.env.NEXT_PUBLIC_PAYMASTER_URL as string,
    chainId: string = ChainId.GOERLI,
  ) {
    this.privateKey = privateKey
    this.rpcUrl = rpcUrl
    this.paymasterUrl = paymasterUrl
    this.paymaster = null
    this.account = null
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl)
    this.signer = new ethers.Wallet(privateKey, this.provider)
    this.entryPoint = ContractAddress[chainId]!.entryPoint
    this.accountFactory = ContractAddress[chainId]!.accountFactory
    this.chainId = chainId
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    return this.provider
  }

  getSigner(): ethers.Wallet {
    return this.signer
  }

  getPaymasterUrl(): string {
    return this.paymasterUrl
  }

  getAccount(): Presets.Builder.SimpleAccount {
    if (!this.account) {
      throw new Error('Please create account first!')
    }
    return this.account
  }

  async getBalance(): Promise<ethers.BigNumber> {
    if (!this.account) {
      throw new Error('Please create account first!')
    }
    const balance = this.provider.getBalance(this.account!.getSender())
    return balance
  }

  buildPaymaster() {
    this.paymaster = Presets.Middleware.verifyingPaymaster(this.paymasterUrl, {
      type: 'payg',
    })
  }

  setEntryPoint(entryPoint: string) {
    this.entryPoint = entryPoint
  }

  setAccountFactory(accountFactory: string) {
    this.accountFactory = accountFactory
  }

  setRpcUrl(rpcUrl: string) {
    this.rpcUrl = rpcUrl
  }

  setPaymasterUrl(paymasterUrl: string) {
    this.paymasterUrl = paymasterUrl
  }

  async createAccount(): Promise<UserOperationService> {
    const account = await Presets.Builder.SimpleAccount.init(
      new ethers.Wallet(this.privateKey) as any,
      this.rpcUrl,
      this.entryPoint,
      this.accountFactory,
      this.paymaster,
    )
    this.account = account
    return this
  }
}

export default UserOperationService
