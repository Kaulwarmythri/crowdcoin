import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Campaign from "../../../ethereum/campaign"
import { Button, Card, Container, Form, Icon, Input, Label, Message, Modal } from 'semantic-ui-react';
import Topbar from '@/components/Navbar';
import Link from 'next/link';
import web3 from '../../../ethereum/web3';

const CampaignDetails = (summary) => {
    const router = useRouter();
    
    const [state, setState] = useState({
      items: [],
      isModalOpen: false,
      errorMessage: "",
      contributedAmount: '0',
      loading: false,
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setState({...state, loading: true});
      try {
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(router.query.campaignAddress);
        await campaign.methods.contribute().send({from: accounts[0], value: web3.utils.toWei(state.contributedAmount, 'ether')});
        setState({...state, loading: false});

        router.replace(`/camapaigns/${router.query.campaignAddress}`);
      } catch(err) {
        setState({...state, errorMessage: err.message});
      }
    }

    useEffect(() => {
      console.log(summary);
      const list = [
        {
          header: Number(summary.minimumContribution),
          meta: "Minimum Contribution (wei)",
          description: "The minimum amount in wei needed to contribute to be a part of this campaign",
          // style: {overflowWrap: 'break-word'}
          fluid: true
        },
        {
          header: Number(summary.balance),
          meta: "Balance of this camapign in wei",
          description: "Current balance of the campaign",
          fluid: true
        },
        {
          header: Number(summary.noOfRequests),
          meta: "Number of requests",
          description: "Number of donation requests created by the manager",
          fluid: true
        },
        {
          header: Number(summary.numOfContributors),
          meta: "Number of contributors",
          description: "Number of people who have donated to this campaign",
          fluid: true
        },
      ]
      setState({...state, items: list});
    }, [])

  return (
    <>
    <Topbar/>
    <Container style={{margin: "20px"}}>
      
      <Button as='div' labelPosition='right' floated='right' onClick={() => setState({...state, isModalOpen: true})}>
        <Button icon>
          <Icon name='plus circle' color='blue'/>
        </Button>
        <Label as='a' basic pointing='left'>
          Click to contribute
        </Label>
      </Button>

      <h3 style={{marginBottom: "30px"}}>Campaign: {router.query.campaignAddress}</h3>

      <h3 style={{marginBottom: "30px"}}>Manager: {summary.manager}</h3>

      <Card.Group itemsPerRow={2} items={state.items} />

      <Link href={`/campaigns/${router.query.campaignAddress}/requests`}>
        <Button as='div' labelPosition='right' onClick={() => {}} style={{marginTop: '20px'}}>
          <Button icon>
            <Icon name='plus circle' color='blue'/>
          </Button>
          <Label as='a' basic pointing='left'>
            Click to view requests
          </Label>
        </Button>
      </Link>
      
      <Modal
        closeIcon
        dimmer='blurring'
        open={state.isModalOpen}
        onClose={() => setState({...state, isModalOpen: false})}
        >
        <Modal.Header>Contribute to the campaign</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit} error={!!state.errorMessage}>
              <Input
                label="ether" 
                labelPosition='right' 
                placeholder="Amount you would like to contribute" 
                value={state.contributedAmount}
                onChange={(e) => setState({...state, contributedAmount: e.target.value})}
                type='number'
              />
            <Form.Field/>
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

CampaignDetails.getInitialProps = async(props) => {
  const campaign = Campaign(props.query.campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  return {
    minimumContribution: summary[0],
    balance: summary[1],
    noOfRequests: summary[2],
    numOfContributors: summary[3],
    manager: summary[4]
  };
}

export default CampaignDetails