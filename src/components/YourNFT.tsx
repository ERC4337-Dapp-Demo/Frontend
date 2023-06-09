import { Button } from 'antd';
import { useContext } from 'react';

import { useGetAllNfts } from '@/apis/nftApi';
import type { Web3ContextType } from '@/contexts/web3Context';
import { Web3Context } from '@/contexts/web3Context';

import { NftItemState } from '../enums/nft';
import NftItem from './common/NftItem';

const YourNFT: React.FC<{ address: string }> = ({ address }) => {
  const { store } = useContext<Web3ContextType | null>(
    Web3Context
  ) as Web3ContextType;
  const { data, refetch } = useGetAllNfts(address);

  return (
    <div id="your-nft">
      <div className="mt-[40px] mb-[20px] flex items-center">
        <h2 className="text-bold mr-[16px] mb-0 text-[36px]">Your NFT</h2>
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
                item={{
                  image: item.metadata?.image || null,
                  name: item.name,
                  tokenAddress: item.tokenAddress,
                  tokenId: item.tokenId,
                  contractType: item.contractType,
                  amount: item.amount,
                  owner: item.ownerOf as string | undefined,
                }}
                state={NftItemState.INVENTORY}
                isOwned={false}
                execution={store!.executionOpService}
                userOperation={store!.userOpService}
                key={`Your NFT - ${index}`}
              />
            );
          })}
      </div>
    </div>
  );
};

export default YourNFT;
