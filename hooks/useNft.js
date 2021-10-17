import { useCallback, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

import {
  nftAddress,
  nftMarketAddress
} from '../utils/config'

// Enum loading state
export const loadingState = {
  notLoaded: 'NOT_LOADED',
  loading: 'LOADING',
  loaded: 'LOADED'
}

export const loadType = {
  owned: 'OWNED',
  created: 'CREATED'
}

const useNft = () => {
  const [nfts, setNfts] = useState({items: [], loading: loadingState.notLoaded})

  const loadNfts = useCallback(async ({ type = loadType.owned } = {}) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    setNfts(state => ({ ...state, loading: loadingState.loading }))
    
    let data = null
    switch (type) {
      case loadType.owned:
        data = await marketContract.fetchMyNFTs()
        break;
      case loadType.created:
        data = await marketContract.fetchItemsCreated()
        break;
    
      default:
        data = []
    }

    const items = await Promise.all(
      data.map(async (i) => {
        console.log(i)
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          sold: i.sold
        }
      })
    )

    setNfts({
      items,
      loading: loadingState.loaded
    })
  }, [setNfts])

  const loadMarketNfts = useCallback(async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
    setNfts(state => ({ ...state, loading: loadingState.loading }))  
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        return {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }
      })
    )

    setNfts({
      items,
      loading: loadingState.loaded
    })
  }, [setNfts])

  const buyNft = useCallback(async (nft) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, { value: price })

    await transaction.wait()
    await loadMarketNfts()
  }, [loadMarketNfts])

  const createSale = useCallback(async (url, customPrice) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)

    const signer = provider.getSigner()
    const contractNFT = new ethers.Contract(nftAddress, NFT.abi, signer)

    const transaction = await contractNFT.createToken(url)
    const tx = await transaction.wait()

    const event = tx.events[0]
    const value = event.args[2]
    const tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(customPrice, 'ether')
    
    const contractMarket = new ethers.Contract(nftMarketAddress, Market.abi, signer)
    let listingPrice = await contractMarket.getListingPrice()
    listingPrice = listingPrice.toString()

    const transactionMarket = await contractMarket.createMarketItem(nftAddress, tokenId, price, { value: listingPrice })
    await transactionMarket.wait()
  }, [])

  return {
    nfts,
    loadNfts,
    loadMarketNfts,
    buyNft,
    createSale
  }
}

export default useNft