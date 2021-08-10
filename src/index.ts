import Web3 from "web3";
import { Exchange } from "../types/web3-v1-contracts/exchange";
import { web3Provider } from "./web3Provider";
const abi = require("../abi/exchange.json");
const EXCHANGE_ADDRESS = "0x9F40dfA0834D47E9580ccB64aF1150E0E40E3F8B";
import dotenv from 'dotenv'

dotenv.config()
//before calling this function make sure to call the approve function of the PERI TOKEN
//cuz the addLiquidity function uses transferFrom which is more sescure.
const addLiquidity = async (tokenAmount: number) => {
  try {
    const web3 = web3Provider();
    const exchange = (new web3.eth.Contract(
      abi,
      EXCHANGE_ADDRESS
    ) as any) as Exchange;

    let count = await web3.eth.getTransactionCount(
      '0xdF4FbF279b2b54989C8CCb0AC6CA8c146C3Ed782',
      'pending',
    );
    const gasPriceInWei = await web3.eth.getGasPrice()
    const gasPriceInGwei = web3.utils.fromWei(gasPriceInWei, 'gwei');
    let rawTransaction = {
      from: '0xdF4FbF279b2b54989C8CCb0AC6CA8c146C3Ed782',
      to: '0x9F40dfA0834D47E9580ccB64aF1150E0E40E3F8B',
      data: exchange.methods.addLiquidity(tokenAmount).encodeABI(),
      gasPrice: gasPriceInGwei,
      nonce: count,
      gasLimit: web3.utils.toHex(2000000),
    };
    let signed = await web3.eth.accounts.signTransaction(
      rawTransaction,
      process.env.PRIVATE_KEY!,
    );
    await web3.eth
      .sendSignedTransaction(signed.rawTransaction!)
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          return true;
        }
      })
      .on('error', error => {
        return false;
      })
      .on('transactionHash', async hash => {
        console.log('transaction has -->', hash);
      });
    // const tokenReserve = await exchange.methods
    //   .addLiquidity(tokenAmount)
    //   .call();
    // console.log(`Token reserve of our swap is ${tokenReserve}`);
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  try {
    const web3 = web3Provider();
    const exchange = (new web3.eth.Contract(
      abi,
      EXCHANGE_ADDRESS
    ) as any) as Exchange;
    const tokenReserve = await exchange.methods.getReserve().call();
    console.log(`Token reserve of our swap is ${tokenReserve}`);
  } catch (err) {
    console.log("Err", err);
  }
};

main();
