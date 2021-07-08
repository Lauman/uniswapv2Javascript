const {ChainId,Fetcher, WETH, Route,Trade,TokenAmount,TradeType, Percent}  = require('@uniswap/sdk');
const { ethers } = require('ethers');
const { private_key,idInfura } = require('./config');
const chainId= ChainId.ROPSTEN;
const tokenAddress = '0x31f42841c2db5173425b5223809cf3a38fede360';

const PRIVATE = private_key;


const init = async () => {
 const dai = await Fetcher.fetchTokenData(chainId,tokenAddress);
 const weth = WETH[chainId];
 const pair = await Fetcher.fetchPairData(dai,weth);
 const route = new Route([pair],weth);
 const trade = new Trade(route, new TokenAmount(weth,'100000000000000000'), TradeType.EXACT_INPUT);
 console.log(route.midPrice.toSignificant(6));
 console.log(route.midPrice.invert().toSignificant(6));
 console.log(trade.executionPrice.toSignificant(6));
 console.log(trade.nextMidPrice.toSignificant(6));

 const slippageTolerance = new Percent('50', '10000');
 const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
 const path = [weth.address, dai.address];
 const to = '0xe50110D15891D0773FDFF5328533ee173aD313E8';
 const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
 const value = trade.inputAmount.raw;
   const inputAmountHex = ethers.BigNumber.from(value.toString()).toHexString(); 
  const amountInHex = ethers.BigNumber.from(value.toString()).toHexString();
  const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();

 const provider = ethers.getDefaultProvider('ropsten', {
     infura: idInfura
 });

 const signer = new ethers.Wallet(PRIVATE);
 const account = signer.connect(provider);
  const uniswap = new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
    account
  );

const tx = await uniswap.swapExactETHForTokens(
    amountOutMinHex,
    path,
    to,
    deadline,
    { value: inputAmountHex, 
      gasPrice:  20e9 ,
      gasLimit: ethers.BigNumber.from(300000).toHexString()}
);
console.log(`Transaction hash: ${tx.hash}`);
const receipt = await tx.wait();
console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

init();