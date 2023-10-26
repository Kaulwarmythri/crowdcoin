pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public{
        address new_campaign = new Campaign(msg.sender, minContribution);
        deployedCampaigns.push(new_campaign);
    }

    function getCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approval_count;
        mapping(address => bool) approvals;
    }
    address public manager;
    uint public min_amount;
    mapping(address => bool) public contributors;
    uint public num_contributors;
    mapping(uint => Request) public requests;
    uint public numOfRequests;

    function Campaign(address _manager, uint _minContribution) public{
        manager = _manager;
        min_amount = _minContribution;
    }

    function contribute() public payable {
        require(msg.value > min_amount);

        contributors[msg.sender] = true;
        num_contributors++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory new_req = Request({
            description: description, 
            value: value, 
            recipient: recipient, 
            complete: false,
            approval_count: 0
        });

        requests[numOfRequests] = new_req;
        numOfRequests++;
    }

    function approveRequest(uint id) public {
        Request storage req = requests[id];
        require(contributors[msg.sender]);

        require(!req.approvals[msg.sender]);

        req.approval_count++;
        req.approvals[msg.sender] = true; 
    }

    function finaliseRequest(uint id) public restricted {
        Request storage req = requests[id];
        require(!req.complete);


        require(req.approval_count > (num_contributors / 2));
        req.recipient.transfer(req.value);
        req.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            min_amount,
            this.balance,
            numOfRequests,
            num_contributors,
            manager
        );
    }

    modifier restricted{
        require(msg.sender == manager);
        _;
    }

}


