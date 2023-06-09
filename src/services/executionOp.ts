import { Client } from "userop";
import UserOperationService from "./userOperation";
import { ethers } from "ethers";
import { UserOperationEventEvent } from "userop/dist/typechain/EntryPoint";

class ExecutionOpService {
  protected client: Client | null;
  protected op: UserOperationService;

  constructor(op: UserOperationService) {
    this.op = op;
    this.client = null;
  }

  async buildClient() {
    const client = await Client.init(this.op.rpcUrl, this.op.entryPoint);
    this.client = client;
  }

  setOp(op: UserOperationService) {
    this.op = op;
  }

  async execute(
    to: string,
    amount: ethers.BigNumber,
    data: ethers.utils.BytesLike
  ): Promise<UserOperationEventEvent | null> {
    if (!this.client) {
      throw new Error("Please build client first!");
    }

    const response = await this.client.sendUserOperation(
      this.op.getAccount().execute(to, amount, data),
      {
        onBuild: (opData) => {
          console.log("Signed UserOperation:", opData);
        },
      }
    );

    console.log(response);
    return response.wait();
  }
}

export default ExecutionOpService;
