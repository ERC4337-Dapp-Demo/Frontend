import { Button, InputNumber, Modal, notification } from 'antd'
import { ethers } from 'ethers'
import { useState } from 'react'

import type { NFTDataItem } from '@/@types/nft'
import ERC721Abi from '@/abis/ERC721.json'
import MarketplaceAbi from '@/abis/Marketplace.json'
import { ContractAddress } from '@/configs/contract'
import { getIpfsUrl } from '@/configs/getUrl'
import { NftItemState } from '@/enums/nft'
import type ExecutionOpService from '@/services/executionOp'
import type UserOperationService from '@/services/userOperation'

import RenderIf from './RenderIf'

const NftItem: React.FC<{
  item: NFTDataItem
  state: NftItemState
  isOwned: boolean
  execution: ExecutionOpService
  userOperation: UserOperationService
}> = ({ item, state, isOwned = false, userOperation, execution }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [imgLoading, setImgLoading] = useState<boolean>(false)
  const [modalState, setModalState] = useState({
    listing: false,
    saling: false,
    canceling: false,
  })
  const [selectAmount, setSelectAmount] = useState(0)
  const [selectPrice, setSelectPrice] = useState<ethers.BigNumber>(ethers.BigNumber.from(0))
  const marketAddress = ContractAddress[userOperation.chainId]!.marketplace
  const marketContract = new ethers.Contract(marketAddress, MarketplaceAbi)
  const erc721Contract = new ethers.Contract(ethers.constants.AddressZero, ERC721Abi)

  const handleError = () => {
    setImgLoading(true)
  }

  const handleListing = () => {
    setModalState({ ...modalState, listing: true })
  }

  const handleCanceling = () => {
    setModalState({ ...modalState, canceling: true })
  }
  const handleBuying = () => {
    setModalState({ ...modalState, saling: true })
  }

  const handleAcceptListing = async () => {
    setLoading(true)
    setModalState({ ...modalState, listing: false })
    console.log(item.tokenAddress.toString())
    try {
      console.log('Call to Approve')
      await execution.execute(
        item.tokenAddress.toJSON(),
        ethers.BigNumber.from(0),
        erc721Contract.interface.encodeFunctionData('approve', [
          marketAddress,
          item.tokenId.toString(),
        ]),
      )
      console.log('Call to Market')
      const tx = await execution.execute(
        marketAddress,
        ethers.BigNumber.from(0),
        item.contractType === 'ERC721'
          ? marketContract.interface.encodeFunctionData('listItem', [
              item.tokenAddress.toJSON(),
              item.tokenId.toString(),
              ethers.constants.AddressZero,
              selectPrice.toString(),
            ])
          : marketContract.interface.encodeFunctionData('listBulkItems', [
              item.tokenAddress.toJSON(),
              item.tokenId.toString(),
              selectAmount.toString(),
              ethers.constants.AddressZero,
              selectPrice.toString(),
            ]),
      )
      console.log(tx)
      notification.success({
        message: 'Listing Item Successfully',
        description: `View at https://goerli.etherscan.io/tx/${tx!.transactionHash}`,
        onClick: () => {
          window.open(`https://goerli.etherscan.io/tx/${tx!.transactionHash}`, '_blank')
        },
      })
    } catch (err: any) {
      notification.error({
        message: 'Listing Item Failed',
        description: `Error: ${err?.message as string}`,
      })
    }
    setLoading(false)
  }

  const handleRefuseListing = () => {
    setModalState({ ...modalState, listing: false })
  }

  const handleAcceptCanceling = async () => {
    setModalState({ ...modalState, canceling: false })
    setLoading(true)
    try {
      if (!item?.marketId) {
        throw new Error('Market id does not exist!')
      }
      console.log('Call to Market')
      const tx = await execution.execute(
        marketAddress,
        ethers.BigNumber.from(0),
        marketContract.interface.encodeFunctionData('cancelItem', [
          item.tokenAddress.toString(),
          item.tokenId.toString(),
          item.marketId,
        ]),
      )
      console.log(tx)
      notification.success({
        message: 'Cancel Listing Successfully',
        description: `View at https://goerli.etherscan.io/tx/${tx!.transactionHash}`,
        onClick: () => {
          window.open(`https://goerli.etherscan.io/tx/${tx!.transactionHash}`, '_blank')
        },
      })
    } catch (err: any) {
      notification.error({
        message: 'Cancel Listing Failed',
        description: `Error: ${err?.message as string}`,
      })
    }
    setLoading(false)
  }

  const handleRefuseCanceling = () => {
    setModalState({ ...modalState, canceling: false })
  }

  const handleAcceptBuying = async () => {
    setModalState({ ...modalState, saling: false })
    setLoading(true)
    try {
      if (!item?.marketId) {
        throw new Error('Market id does not exist!')
      }
      console.log('Call to Market')
      const tx = await execution.execute(
        marketAddress,
        item.price as ethers.BigNumber,
        marketContract.interface.encodeFunctionData('buyItem', [
          item.tokenAddress.toString(),
          item.tokenId.toString(),
          item.marketId,
          selectAmount,
        ]),
      )
      console.log(tx)
      notification.success({
        message: 'Buying Item Successfully',
        description: `View at https://goerli.etherscan.io/tx/${tx!.transactionHash}`,
        onClick: () => {
          window.open(`https://goerli.etherscan.io/tx/${tx!.transactionHash}`, '_blank')
        },
      })
    } catch (err: any) {
      notification.error({
        message: 'Buying Item Failed',
        description: `Error: ${err?.message as string}`,
      })
    }
    setLoading(false)
  }

  const handleRefuseBuying = () => {
    setModalState({ ...modalState, saling: false })
  }

  const handleSelectAmount = (e: any) => {
    setSelectAmount(e as number)
  }

  const handleSelectPrice = (e: any) => {
    const value = ethers.utils.parseEther(e?.toString() || '0')
    setSelectPrice(value)
  }

  return (
    <>
      <Modal
        title='Listing Item'
        centered
        open={modalState.listing}
        onOk={handleAcceptListing}
        onCancel={handleRefuseListing}
        width={600}
      >
        <h2 className='text-bold'>
          You are going to list an nft (Notice: the action is unable to revert)
        </h2>
        <p>Please choose the quantity</p>
        <InputNumber
          className='w-full'
          placeholder='Please input number'
          defaultValue={1}
          onChange={handleSelectAmount}
        />
        <InputNumber
          className='w-full'
          placeholder='Please input price'
          defaultValue={0}
          onChange={handleSelectPrice}
        />
      </Modal>
      <Modal
        title='Cancel Listing Item'
        centered
        open={modalState.canceling}
        onOk={handleAcceptCanceling}
        onCancel={handleRefuseCanceling}
        width={600}
      >
        <h2 className='text-bold'>
          You are going to cancel listing an nft (Notice: the action is unable to revert)
        </h2>
      </Modal>
      <Modal
        title='Buying Item'
        centered
        open={modalState.saling}
        onOk={handleAcceptBuying}
        onCancel={handleRefuseBuying}
        width={600}
      >
        <h2 className='text-bold'>
          You are going to buy an nft (Notice: the action is unable to revert)
        </h2>
        <p>Please choose the quantity</p>
        <InputNumber
          className='w-full'
          placeholder='Please input number'
          defaultValue={1}
          onChange={handleSelectAmount}
        />
      </Modal>
      <div id='nft-item' className=''>
        <img
          src={imgLoading || !item?.image ? '/default.png' : getIpfsUrl(item?.image as string)}
          className='mb-[12px] max-h-[360px] w-full'
          width={360}
          height={360}
          onError={handleError}
        ></img>
        <p>Name: {(item.name || 'UNKNOWN') as string}</p>
        <p>Amount: {item.amount as string}</p>
        <p>Type: {item.contractType as string}</p>
        <RenderIf isTrue={state === NftItemState.INVENTORY}>
          <Button
            type='primary'
            onClick={handleListing}
            className='w-full bg-[#1677ff]'
            loading={loading}
          >
            List Item
          </Button>
        </RenderIf>
        <RenderIf isTrue={state === NftItemState.LISTING && isOwned === true}>
          <p>Price: {item.price ? ethers.utils.formatEther(item.price) : 0}</p>
          <Button
            type='primary'
            className='w-full bg-[#1677ff]'
            onClick={handleCanceling}
            loading={loading}
          >
            Cancel Item
          </Button>
        </RenderIf>
        <RenderIf isTrue={state === NftItemState.LISTING && isOwned === false}>
          <p>Price: {item.price ? ethers.utils.formatEther(item.price) : 0}</p>
          <Button
            type='primary'
            className='w-full bg-[#1677ff]'
            onClick={handleBuying}
            loading={loading}
          >
            Buy Item
          </Button>
        </RenderIf>
      </div>
    </>
  )
}

export default NftItem
