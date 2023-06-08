import { useGetAllNfts } from "@/apis/nftApi";
import { getIpfsUrl } from "@/configs/getUrl";
import { Button } from "antd";
import React from "react";
import NftItem from "./common/NftItem";
import { NftItemState } from "../enums/nft";
import { useContext } from "react";
import { Web3Context, Web3ContextType } from "@/contexts/web3Context";

const YourNFT: React.FC<{ address: string }> = ({ address }) => {
  const { account } = useContext<Web3ContextType | null>(
    Web3Context
  ) as Web3ContextType;
  const { data, refetch } = useGetAllNfts(address);

  return (
    <div id="your-nft">
      <div className="flex items-center mt-[40px] mb-[20px]">
        <h2 className="mr-[16px] mb-0 text-[36px] text-bold">Your NFT</h2>
        <Button
          onClick={() => {
            refetch();
          }}
        >
          Refetch
        </Button>
      </div>
      <div id="nfts" className="grid grid-cols-4 gap-[12px]">
        {data &&
          data.result.map((item: any, index) => {
            return (
              <NftItem
                item={item}
                state={NftItemState.INVENTORY}
                isOwned={false}
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
};

export default YourNFT;
