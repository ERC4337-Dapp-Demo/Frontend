import { useQuery } from '@tanstack/react-query'

import MoralisService from '@/services/moralis'

export const useGetAllNfts = (address: string) => {
  return useQuery(['get-all-nfts'], () => MoralisService.getAllNFTsFromWallet(address))
}
