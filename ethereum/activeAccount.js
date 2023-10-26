import web3 from "./web3";

let activeAccount;

const func = async () => {
    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        const accounts = await web3.eth.getAccounts();
        activeAccount = accounts[0];
        window.ethereum.on('accountsChanged', function (accounts) {
            activeAccount = accounts[0];
            console.log(accounts[0])
    });
    
    } else {
        activeAccount = await web3.eth.getAccounts()[0];
    }
}
func();
export default activeAccount;