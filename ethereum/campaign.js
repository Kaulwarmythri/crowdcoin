import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const showInstance = (campaignAddress) => {
    return new web3.eth.Contract(JSON.parse(Campaign.interface), campaignAddress);
}

export default showInstance;