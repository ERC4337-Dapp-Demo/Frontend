import MoralisService from "@/services/moralis";
import { useQuery } from "@tanstack/react-query";

export const useGetAllNfts = (address: string) => {
  return useQuery(["get-all-nfts"], () =>
    MoralisService.getAllNFTsFromWallet(address)
  );
};
