/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'

import Ipfs from '../services/ipfs';

const CreateItem = () => {
    const [formInput, setFormInput] = useState({
        description: '',
        name: '',
        price: '',
        fileUrl: ''
    });
    const router = useRouter()

    const createMarket = () => {

    }

    return (
        <div className="flex justify-center">
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
              placeholder="Asset Price in Eth"
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
            <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
              Create Digital Asset
            </button>
          </div>
        </div>
      )
}

export default CreateItem;