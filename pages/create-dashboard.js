import { useEffect } from 'react'

import Image from 'next/image'

import useNft, { loadingState, loadType } from '../hooks/useNft'

export default function Dashboard() {

  const { 
    nfts: { items, loading }, 
    loadNfts
  } = useNft()


  useEffect(() => {
    const load = async () => {
      await loadNfts({ type: loadType.created });
    }
    load();
  }, [loadNfts])

  if (loading === loadingState.loaded && !items.length ) {
    return (
      <h2 className="px-20 py-10 text-3xl">
        - No items created -
      </h2>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {items.map((item, i) => (
            <div key={i} className="border shadow rounded-lg overflow-hidden relative">
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
              </div>
              {item.sold && (
                <div className="flex justify-center absolute top-0 left-0 w-full p-1 bg-red-500 bg-opacity-60 text-white font-bold">
                  SOLD
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
