import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'

class MoralisService {
  static async start() {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  // TODO: add limit and cursor for pagination
  static async getAllNFTsFromWallet(address: string, chain: EvmChain = EvmChain.GOERLI) {
    return Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    })
  }
}

export default MoralisService
