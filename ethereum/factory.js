import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0x9ae454B5628193A0EF2B4517A31321AcED934e75'
);

export default instance;