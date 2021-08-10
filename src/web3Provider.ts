import Web3 from "web3";

export const web3Provider = (): Web3 => {
  const RPC_HOST =
    "wss://rinkeby.infura.io/ws/v3/3036aca03923465ead82b80c14e02614";
  const web3 = new Web3(RPC_HOST);
  return web3;
};
