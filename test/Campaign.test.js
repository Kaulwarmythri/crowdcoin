import assert from "assert";
import ganache from "ganache";
import Web3 from "web3";
import compiledFactory from "../ethereum/build/CampaignFactory.json" assert { type: "json" };
import compiledCampaign from "../ethereum/build/Campaign.json" assert { type: "json" };;

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                        .deploy({data: compiledFactory.bytecode})
                        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({from: accounts[0], gas: '1000000'});

    [campaignAddress] = await factory.methods.getCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    // it('adds contributors', async () => {
    //     await campaign.methods.contribute().send({from: accounts[1], value: '150'});
    //     assert.equal(true, await campaign.methods.contributors(accounts[1]).call());
    // });
    // it('allows manager to make request', async () => {
    //     await campaign.methods.createRequest(1, 'buy batteries', '100', accounts[2]).send({from: accounts[0], gas: '1000000'});

    //     const request = await campaign.methods.requests(0).call();
    //     assert.equal('buy batteries', request.description);
    // });
    it('processes request', async () => {
        await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei(10, 'ether')});

        await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[2])
        .send({from: accounts[0], gas: '1000000'});

        await campaign.methods.approveRequest(0).send({from: accounts[1], gas: '1000000'});

        await campaign.methods.finaliseRequest(0).send({from: accounts[0], gas: '1000000'});

        let balance = await web3.eth.getBalance(accounts[2])
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
    })
})


