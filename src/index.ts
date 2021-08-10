import Web3 from 'web3'
import { Dai } from '../types/web3-v1-contracts/dai'

const abi = require('../abi/dai.json')

const RPC_HOST = 'wss://mainnet.infura.io/ws/v3/6d6c70e65c77429482df5b64a4d0c943'
const EXCHANGE_ADDRESS = '0x9F40dfA0834D47E9580ccB64aF1150E0E40E3F8B'

async function main() {
  const web3 = new Web3(RPC_HOST)
  const fromWei = web3.utils.fromWei

  const dai = (new web3.eth.Contract(abi, DAI_ADDRESS) as any) as Dai
  const balance = await dai.methods.balanceOf('0x70b144972C5Ef6CB941A5379240B74239c418CD4').call()
  console.log(`Our DAI balance is: ${fromWei(balance)}`)


  const totalSupply = await dai.methods.totalSupply().call()
  console.log("Total supply", totalSupply)
  
  console.log('Listening for transfer events...')

  dai.events.Transfer((err, e) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${fromWei(e.returnValues.wad)} DAI transferred ${e.returnValues.src} -> ${e.returnValues.dst}`)
  })
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
