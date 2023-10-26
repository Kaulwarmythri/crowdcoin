import React, { useEffect, useState } from 'react'
import { Button, Popup, Table } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { useRouter } from 'next/router';

const RequestRow = ({id, request, numOfContributors, campaignAddress, manager}) => {
    const router = useRouter();
    const [state, setState] = useState({
        approveLoading: false,
        finaliseLoading: false,
        errorMessage: ''
    });

    const readyToFinalise = Number(request.approval_count) > numOfContributors / 2;

    const {Row, Cell} = Table;
    const handleApprove = async (id) => {
        console.log(id);
        
        setState({...state, approveLoading: true})
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(campaignAddress);
        await campaign.methods.approveRequest(id).send({
            from: accounts[0],
        });
        setState({...state, approveLoading: true})
        router.replace(`/campaigns/${campaignAddress}/requests`)
    }

    const handleFinalise = async (id) => {
        setState({...state, finaliseLoading: true})

        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(campaignAddress);

        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0],
        });

        setState({...state, finaliseLoading: true})
        router.replace(`/campaigns/${campaignAddress}/requests`)
    }
  return (
    <Row disabled={request.complete} positive={readyToFinalise && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{Number(request.value)}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{`${Number(request.approval_count)} / ${Number(numOfContributors)}`}</Cell>
        <Cell>
            <Popup
                content='You can only approve this request if you are a contributor to this campaign'
                position='top center' 
                trigger={<Button 
                    color='green' 
                    onClick={() => handleApprove(id)} 
                    loading={state.approveLoading}
                    disabled={request.complete}>
                    Approve
                </Button>}
            />
        </Cell>
        <Cell>
            <Popup
                content='Only the manager of this campaign can finalise this request'
                position='top center' 
                trigger={
                <Button 
                    color='blue' 
                    onClick={() => handleFinalise()} 
                    loading={state.finaliseLoading} 
                    disabled={request.complete}>
                    Finalize
                </Button>} 
            />
        </Cell>
    </Row>
  )
}

export default RequestRow