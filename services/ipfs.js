
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from 'axios'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const getIpfsUrl = (path) => `https://ipfs.infura.io/ipfs/${path}`;

export const addIpfsImage = async (file) => {
    try {
        const added = await client.add(file, {
            progress: (prog) => console.log(`Received: ${prog}`)
        })
        const url = getIpfsUrl(added.path)
        return url;
    } catch (error) {
        console.log(error)
    }
}

export const addIpfs = async (data) => {
    try {
        const added = await client.add(data)
        return getIpfsUrl(added.path);
    } catch (error) {
        console.log(error)
    }
}