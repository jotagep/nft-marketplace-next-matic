
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from 'axios'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const getIpfsUrl = (path) => `https://ipfs.infura.io/ipfs/${path}`;

class Ipfs {
    static async addIpfs (file) {
        try {
            const added = await this.client.add(file, {
                progress: (prog) => console.log(`Received: ${prog}`)
            })
            const url = getIpfsUrl(added.path)
        } catch (error) {
            console.log(error)
        }
    }
}

export default Ipfs;