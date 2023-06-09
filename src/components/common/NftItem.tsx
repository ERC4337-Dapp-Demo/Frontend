import React from "react";
import { NftItemState } from "@/enums/nft";
import { useState } from "react";
import { getIpfsUrl } from "@/configs/getUrl";
import RenderIf from "./RenderIf";
import { Button, Modal, InputNumber, notification } from "antd";
import ExecutionOpService from "@/services/executionOp";
import UserOperationService from "@/services/userOperation";
import { ethers } from "ethers";
import { ContractAddress } from "@/configs/contract";
import MarketplaceAbi from "@/abis/Marketplace.json";
import ERC721Abi from "@/abis/ERC721.json";

const NftItem: React.FC<{
  item: any;
  state: NftItemState;
  isOwned: boolean;
  execution: ExecutionOpService;
  userOperation: UserOperationService;
}> = ({ item, state, isOwned = false, userOperation, execution }) => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalState, setModalState] = useState({
    listing: false,
    saling: false,
    canceling: false,
  });
  const [selectAmount, setSelectAmount] = useState(0);
  const [selectPrice, setSelectPrice] = useState<ethers.BigNumber>(
    ethers.BigNumber.from(0)
  );
  const marketAddress = ContractAddress[userOperation.chainId]!.marketplace;
  const marketContract = new ethers.Contract(marketAddress, MarketplaceAbi);
  const erc721Contract = new ethers.Contract(
    ethers.constants.AddressZero,
    ERC721Abi
  );

  const handleError = () => {
    setLoading(true);
  };

  const handleListing = () => {
    setModalState({ ...modalState, listing: true });
  };

  const handleAcceptListing = async () => {
    setLoading(true);
    try {
      console.log("Call to Approve");
      await execution.execute(
        item.tokenAddress._value,
        ethers.BigNumber.from(0),
        erc721Contract.interface.encodeFunctionData("approve", [
          marketAddress,
          item.tokenId.toString(),
        ])
      );
      console.log("Call to Market");
      const tx = await execution.execute(
        marketAddress,
        ethers.BigNumber.from(0),
        item.contractType == "ERC721"
          ? marketContract.interface.encodeFunctionData("listItem", [
              item.tokenAddress._value,
              item.tokenId.toString(),
              ethers.constants.AddressZero,
              selectPrice.toString(),
            ])
          : marketContract.interface.encodeFunctionData("listBulkItems", [
              item.tokenAddress._value,
              item.tokenId.toString(),
              selectAmount.toString(),
              ethers.constants.AddressZero,
              selectPrice.toString(),
            ])
      );
      console.log(tx);
      api["success"]({
        message: "Listing Item Successfully",
        description: `View at https://goerli.etherscan.io/tx/${
          tx!.transactionHash
        }`,
        onClick: () => {
          window.open(
            `https://goerli.etherscan.io/tx/${tx!.transactionHash}`,
            "_blank"
          );
        },
      });
    } catch (err: any) {
      api["success"]({
        message: "Listing Item Failed",
        description: `Error: ${err?.message as string}`,
      });
    }
    setLoading(false);
  };

  const handleRefuseListing = () => {
    setModalState({ ...modalState, listing: false });
  };

  const handleSelectAmount = (e: any) => {
    setSelectAmount(e as number);
  };

  const handleSelectPrice = (e: any) => {
    const value = ethers.utils.parseEther(e?.toString() || "0");
    setSelectPrice(value);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Listing Item"
        centered
        open={modalState.listing}
        onOk={handleAcceptListing}
        onCancel={handleRefuseListing}
        width={600}
      >
        <h2 className="text-bold">
          You are going to list an nft (Notice: the action is unable to revert)
        </h2>
        <p>Please choose the quantity</p>
        <InputNumber
          className="w-full"
          placeholder="Please input number"
          defaultValue={0}
          onChange={handleSelectAmount}
        />
        <InputNumber
          className="w-full"
          placeholder="Please input price"
          defaultValue={0}
          onChange={handleSelectPrice}
        />
      </Modal>
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
        <p>Amount: {item.amount as string}</p>
        <p>Type: {item.contractType as string}</p>
        <RenderIf isTrue={state == NftItemState.INVENTORY}>
          <Button
            type="primary"
            onClick={handleListing}
            className="bg-[#1677ff] w-full"
            loading={loading}
          >
            List Item
          </Button>
        </RenderIf>
        <RenderIf isTrue={state == NftItemState.MY_LISTING}>
          <Button type="primary" className="bg-[#1677ff] w-full">
            Cancel Item
          </Button>
        </RenderIf>
        <RenderIf
          isTrue={state == NftItemState.ALL_LISTING && isOwned == false}
        >
          <Button type="primary" className="bg-[#1677ff] w-full">
            Buy Item
          </Button>
        </RenderIf>
      </div>
    </>
  );
};

export default NftItem;
