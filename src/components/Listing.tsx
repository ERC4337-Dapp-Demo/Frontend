import { useQuery as useApolloQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";

import type { Web3ContextType } from "@/contexts/web3Context";
import { Web3Context } from "@/contexts/web3Context";
import { GET_ALL_ACTIVE_LISTING } from "@/graphql/marketplace";
import apolloClient from "@/services/apollo";
import { fetchMetadataFromUrl } from "@/services/metadata";

import { NftItemState } from "../enums/nft";
import NftItem from "./common/NftItem";

const Listing: React.FC<{}> = ({}) => {
  const { store } = useContext<Web3ContextType | null>(
    Web3Context
  ) as Web3ContextType;
  const { data } = useApolloQuery(GET_ALL_ACTIVE_LISTING(5, 0), {
    client: apolloClient,
    pollInterval: 1000, // 15s query 1 lan
  });
  const [itemData, setItemData] = useState<any[]>();

  useEffect(() => {
    if (data?.marketplaces) {
      (async () => {
        const dataWithUrl = await Promise.all(
          data.marketplaces.map(async (item: any) => {
            const metadata = await fetchMetadataFromUrl(item.tokenUri);
            return { ...item, metadata };
          })
        );
        setItemData(dataWithUrl);
      })();
    }
  }, [data]);

  return (
    <div id="your-nft">
      <div className="mt-[40px] mb-[20px] flex items-center">
        <h2 className="text-bold mr-[16px] mb-0 text-[36px]">Listing</h2>
      </div>
      <div id="nfts" className="grid grid-cols-4 gap-[12px]">
        {itemData &&
          itemData.map((item: any, index: number) => {
            return (
              <NftItem
                item={{
                  image: item?.metadata?.image || null,
                  name: item?.name || `UNKNOWN ${index}`,
                  tokenAddress: item.nftAddress,
                  tokenId: item.tokenId,
                  contractType: item?.contractType || "ERC721",
                  amount: item.quantity,
                  owner: item.lister,
                  marketId: item.id.split("-")[2],
                  price: item.price,
                }}
                isOwned={
                  item.lister.toLowerCase() ===
                  store!.account.getSender().toLowerCase()
                }
                state={NftItemState.LISTING}
                execution={store!.executionOpService}
                userOperation={store!.userOpService}
                key={`Listing-${index}`}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Listing;
