import Topbar from '@/components/Navbar'
import React, { useState } from 'react'
import { Button, Container, Form, Icon, Input, Label, Message, Modal, Popup, Tab, Table } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import web3 from '../../../../ethereum/web3';
import Campaign from "../../../../ethereum/campaign";
import RequestRow from '@/components/RequestRow';
import { Typography } from '@mui/material';


const RequestsList = (props) => {
    const router = useRouter();
    const [state, setState] = useState({
        isModalOpen: false,
        requests: [],
        value: "",
        description: "",
        recipient: "",
        errorMessage: '',
        loading: false
    });

    const {Header, Row, Body, HeaderCell} = Table;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({...state, loading: true});

        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(router.query.campaignAddress);
            await campaign.methods
                    .createRequest(state.description, web3.utils.toWei(state.value, "ether"), state.recipient)
                    .send({ from: accounts[0] });

            console.log(await campaign.methods.getRequestsCount().call());

            router.push(`/campaigns/${router.query.campaignAddress}/requests`)
            setState({...state, loading: false});
        } catch(err) {
            setState({...state, errorMessage: err.message});
        }
    }

    //0xAc6961B3A0a121C4Bb2bf1737152E80468969470  -- factory
    //campaign -  [0xda4A8e97cc4E2756aD95Aa65ed5F3e63473483a6, 0x2FC95F3657aDd2B6AA0ab9f19ABD36e2599A2C63]

    return (
    <>
        <Topbar/>
        <Container>
            <Popup
                content='Only the manager of this campaign can create a request'
                position='top center' 
                trigger={(
                    <Button as='div' labelPosition='right' floated='right' onClick={() => setState({...state, isModalOpen: true})}>
                        <Button icon>
                        <Icon name='plus circle' color='blue'/>
                        </Button>
                        <Label as='a' basic pointing='left'>
                            Click to add a request
                        </Label>
                    </Button>
                )} 
            style={{marginBottom: '20px'}}
            />

            <Typography variant='h5' mt={4} mb={2}>Requests for : {router.query.campaignAddress}</Typography>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount required (ether)</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {props.requests.map((request, i) => {
                        return (
                            <RequestRow 
                                key={i}
                                id={i}
                                request={request}
                                numOfContributors={Number(props.numOfContributors)}
                                campaignAddress={router.query.campaignAddress}
                                manager={props.manager}
                            />
                        )
                    })}
                </Body>
            </Table>
            {console.log(props)}
            <div style={{marginTop: "20px"}}>Total: {Number(props.requestCount)} requests</div>

            <Modal
                closeIcon
                dimmer='blurring'
                open={state.isModalOpen}
                onClose={() => setState({...state, isModalOpen: false})}>
                <Modal.Header>Add a new request to this campaign</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={handleSubmit}  error={!!state.errorMessage}>
                        <Form.Field>
                            <label>Description</label>
                            <input placeholder='Describe the project you are making this request for' onChange={(e) => {setState({...state, description: e.target.value})}}/>
                        </Form.Field>
                        <Input 
                            label="ether" 
                            labelPosition='right' 
                            placeholder="Amount required for the project" 
                            value={state.amount}
                            onChange={(e) => setState({...state,  amount: e.target.value})}
                            type='number'
                        />
                        <Form.Field>
                            <label>Recipient</label>
                            <input placeholder='Recipient of this request' onChange={(e) => {setState({...state, recipient: e.target.value})}}/>
                        </Form.Field>
                        <Message
                            error
                            header='Oops! looks like something went wrong...'
                            content={state.errorMessage}
                            />
                        <Button type='submit' primary loading={state.loading}>Submit</Button>
                    </Form>

                </Modal.Content>
            </Modal>
        </Container>
    </>
    )
}

RequestsList.getInitialProps = async(prop) => {
    const campaign = Campaign(prop.query.campaignAddress);
    const requestCount = await campaign.methods.numOfRequests().call();
    const numOfContributors = await campaign.methods.num_contributors().call();
    const manager = await campaign.methods.manager().call();

    const requests = await Promise.all(
        Array(Number(requestCount)).fill().map((e, i) => {
            return campaign.methods.requests(i).call();
        })
    );
    return {requests, numOfContributors, requestCount, manager};
  }

export default RequestsList