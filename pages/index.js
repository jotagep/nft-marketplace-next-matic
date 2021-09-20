import { useEffect } from 'react'

import Image from 'next/image'

import useNft, { loadingState } from '../hooks/useNft'

export default function Home() {

  const { 
    nfts: { items, loading }, 
    loadNfts,
    buyNft 
  } = useNft()


  useEffect(() => {
    loadNfts()
  }, [loadNfts])

  const handleBuy = (nft) => () => {
    buyNft(nft)
  }

  if (loading === loadingState.loaded && !items.length ) {
    return (
      <h2 className="px-20 py-10 text-3xl">
        No items in marketplace
      </h2>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {items.map((item, i) => (
            <div key={i} className="border shadow rounded-lg overflow-hidden">
              <Image src={item.img} alt={item.name} />
              <div className="p-4">
                <p style={{height: '64px'}} className="text-2xl font-semibold" >
                  {item.name}
                </p>
                <div style={{ height: '70px' }} className="overflow-hidden">
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">{nft.price} Matic</p>
                <button 
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" 
                  onClick={handleBuy(item)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
