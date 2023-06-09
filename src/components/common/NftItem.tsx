import React from "react";
import { NftItemState } from "@/enums/nft";
import { useState } from "react";
import { getIpfsUrl } from "@/configs/getUrl";
import RenderIf from "./RenderIf";
import { Button } from "antd";
import ExecutionOpService from "@/services/executionOp";
import UserOperationService from "@/services/userOperation";
import { ethers } from "ethers";
import { ContractAddress } from "@/configs/contract";
import MarketplaceAbi from "@/abis/Marketplace.json";

const NftItem: React.FC<{
  item: any;
  state: NftItemState;
  isOwned: boolean;
  execution: ExecutionOpService;
  userOperation: UserOperationService;
}> = ({ item, state, isOwned = false, userOperation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const contract = new ethers.Contract(
    ContractAddress[userOperation.chainId]!.marketplace,
    MarketplaceAbi
  );

  const handleError = () => {
    setLoading(true);
  };

  return (
    <div id="nft-item" className="">
      <img
        src={
          loading ? "/default.png" : getIpfsUrl(item.metadata.image as string)
        }
        className="w-full max-h-[360px] mb-[12px]"
        width={360}
        height={360}
        onError={handleError}
      ></img>
      <p>Name: {item.metadata.name as string}</p>
      <RenderIf isTrue={state == NftItemState.INVENTORY}>
        <Button type="primary" className="bg-[#1677ff] w-full">
          List Item
        </Button>
      </RenderIf>
      <RenderIf isTrue={state == NftItemState.MY_LISTING}>
        <Button type="primary" className="bg-[#1677ff] w-full">
          Cancel Item
        </Button>
      </RenderIf>
      <RenderIf isTrue={state == NftItemState.ALL_LISTING && isOwned == false}>
        <Button type="primary" className="bg-[#1677ff] w-full">
          Buy Item
        </Button>
      </RenderIf>
    </div>
  );
};

export default NftItem;
