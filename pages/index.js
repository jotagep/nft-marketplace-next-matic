import { useEffect } from 'react'

import Image from 'next/image'

import useNft, { loadingState } from '../hooks/useNft'

export default function Home() {

  const { 
    nfts: { items, loading }, 
    loadMarketNfts,
    buyNft 
  } = useNft()

  useEffect(() => {
    const load = async () => {
      await loadMarketNfts();
    }
    load();
  }, [loadMarketNfts])

  const handleBuy = (nft) => () => {
    buyNft(nft)
  }

  console.log(items, loading)

  if (loading === loadingState.loaded && !items.length ) {
    return (
      <h2 className="px-20 py-10 text-3xl">
        - No items in marketplace -
      </h2>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {items.map((item, i) => (
            <div key={i} className="border shadow rounded-lg overflow-hidden">
              <div className="relative w-56 h-36">
                <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-2">
                <p className="text-2xl font-semibold mb-2" >
                  {item.name}
                </p>
                <div className="overflow-hidden">
                  <p className="text-gray-400 mb-2">{item.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">{item.price} Matic</p>
                <button 
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-12 rounded" 
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
