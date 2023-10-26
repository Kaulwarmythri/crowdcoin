import Web3 from "web3";

let web3;

if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    //means we're in browser which has metamask
    window.ethereum.request({method: "eth_requestAccounts"});
    web3 = new Web3(window.ethereum);

} else {
    //we're on the server OR user is not using metamask
    const provider = new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/ab742f225249428db86ad180189baa77')
    web3 = new Web3(provider);
}

export default web3;
