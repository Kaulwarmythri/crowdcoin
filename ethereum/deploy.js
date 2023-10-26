import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import compiledFactory from "../ethereum/build/CampaignFactory.json" assert { type: "json" };

const provider = new HDWalletProvider('endorse bulk grant aware mosquito fork man wish twelve opinion box end', 
'https://sepolia.infura.io/v3/ab742f225249428db86ad180189baa77')   // --> which account to unlock to use ether for deploying contract and which node we're going to connect to
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account - ', accounts[0]);

    const res = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0], gas: '1000000'});

    console.log('Contract deployed to: ', res.options.address);
    provider.engine.stop();
}
deploy();

//Contract deployed to - '0x9ae454B5628193A0EF2B4517A31321AcED934e75'