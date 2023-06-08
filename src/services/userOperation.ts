import { ethers } from "ethers";
import { Client, Presets } from "userop";

class UserOperationService {
  protected privateKey: string;
  protected rpcUrl: string;
  protected paymasterUrl: string;

  protected paymaster: any;
  protected client: Client | null;
  protected account: Presets.Builder.SimpleAccount | null;

  protected provider: ethers.providers.JsonRpcProvider;

  public entryPoint: string = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  public accountFactory: string = "0x9406Cc6185a346906296840746125a0E44976454";

  constructor(
    privateKey: string,
    rpcUrl: string = process.env.NEXT_PUBLIC_RPC_URL as string,
    paymasterUrl: string = process.env.NEXT_PUBLIC_PAYMASTER_URL as string
  ) {
    this.privateKey = privateKey;
    this.rpcUrl = rpcUrl;
    this.paymasterUrl = paymasterUrl;
    this.paymaster = null;
    this.client = null;
    this.account = null;
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    return this.provider;
  }

  getRpcUrl(): string {
    return this.rpcUrl;
  }

  getPaymasterUrl(): string {
    return this.paymasterUrl;
  }

  buildPaymaster() {
    this.paymaster = Presets.Middleware.verifyingPaymaster(this.paymasterUrl, {
      type: "payg",
    });
  }

  setEntryPoint(entryPoint: string) {
    this.entryPoint = entryPoint;
  }

  setAccountFactory(accountFactory: string) {
    this.accountFactory = accountFactory;
  }

  setRpcUrl(rpcUrl: string) {
    this.rpcUrl = rpcUrl;
  }

  setPaymasterUrl(paymasterUrl: string) {
    this.paymasterUrl = paymasterUrl;
  }

  async createAccount(): Promise<Presets.Builder.SimpleAccount> {
    const account = await Presets.Builder.SimpleAccount.init(
      new ethers.Wallet(this.privateKey) as any,
      this.rpcUrl,
      this.entryPoint,
      this.accountFactory,
      this.paymaster
    );
    this.account = account;
    return account;
  }

  async simpleTransfer(
    to: string,
    amount: ethers.BigNumber
  ): Promise<any | null> {
    const client = await Client.init(this.rpcUrl, this.entryPoint);
    const res = await client.sendUserOperation(
      this.account!.execute(to, amount, "0x"),
      {
        onBuild: (op) => console.log("Signed UserOperation:", op),
      }
    );
    console.log(`UserOpHash: ${res.userOpHash}`);

    console.log("Waiting for transaction...");
    const transaction = await res.wait();
    return transaction;
  }
}

export default UserOperationService;
