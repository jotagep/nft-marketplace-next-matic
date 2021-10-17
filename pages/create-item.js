/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import useNFT from '../hooks/useNft'
import { addIpfs, addIpfsImage } from '../services/ipfs';

const defaultState = {
  description: '',
  name: '',
  price: '',
  fileUrl: ''
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const CreateItem = () => {
    const [formInput, setFormInput] = useState(defaultState);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const { 
      createSale
    } = useNFT()

    useEffect(() => {
      return () => {
        setFormInput(defaultState)
      }
    }, [])

    const handleCreateAsset = async () => {
      const { name, description, price, fileUrl } = formInput;
      if (!name || !description || !price || !fileUrl) return;

      try {
        setLoading(true)
        const urlImage = await addIpfsImage(fileUrl)
        const data = JSON.stringify({
          name, description, image: urlImage
        });  
        const url = await addIpfs(data)
        await sleep(200);
        await createSale(url, price)
        setLoading(false)
        console.log('URL: ', url)
        router.replace('/')
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }

    return (
        <div className={`flex justify-center ${loading ? 'opacity-50': ''}`}>
          <div className="w-1/2 flex flex-col pb-12">
            <input 
              placeholder="Asset Name"
              className="mt-8 border rounded p-4"
              onChange={e => setFormInput({ ...formInput, name: e.target.value })}
            />
            <textarea
              placeholder="Asset Description"
              className="mt-2 border rounded p-4"
              onChange={e => setFormInput({ ...formInput, description: e.target.value })}
            />
            <input
              placeholder="Asset Price in Matic"
              className="mt-2 border rounded p-4"
              onChange={e => setFormInput({ ...formInput, price: e.target.value })}
            />
            <input
              type="file"
              name="Asset"
              className="my-4"
              onChange={e => setFormInput({ ...formInput, fileUrl: e.target.files[0] })}
            />
            {
              formInput.fileUrl && (
                <img 
                    className="rounded mt-4 object-contain" 
                    width="350" 
                    src={URL.createObjectURL(formInput.fileUrl)} 
                    alt="Image" 
                />
              )
            }
            <button onClick={handleCreateAsset} className="font-bold mt-4 bg-pink-500 hover:bg-pink-600 text-white rounded p-4 shadow-lg">
              Create Digital Asset
            </button>
          </div>
        </div>
      )
}

export default CreateItem;