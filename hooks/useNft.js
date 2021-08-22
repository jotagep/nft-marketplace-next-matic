/* eslint-disable import/no-anonymous-default-export */
import { useEffect, useState } from 'react'
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

const useNft = () => {
    const [nfts, setNfts] = useState({items: [], loading: loadingState.notLoaded})

    useEffect(() => {
        loadNfts()
    }, [])

    const loadNfts = async () => {
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, provider)
        setNfts(state => ({...state, loading: loadingState.loading}))
        const data = await marketContract.fetchMarketItems()

        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await tokenContract.tokenUri(i.tokenId)
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
    }

    const buyNft = async (nft) => {
        const web3Modal = new web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftMarketAddress, Market.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, { value: price })

        await transaction.wait()
        loadNfts()
    }

    return {
        nfts,
        buyNft
    }
}

export default useNft