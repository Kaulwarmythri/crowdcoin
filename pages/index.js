/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import factory from "../ethereum/factory";
import Campaign from "../ethereum/campaign";
import {Modal, Button, Container, Form, Input, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Topbar from '../components/Navbar';
import web3 from '../ethereum/web3';
import { Grid, Typography } from '@mui/material';
import Card from '../components/CampaignCard';

const Index = ({props}) => {
  const [state, setState] = useState({
    summaries: [],
    items: [],
    isModalOpen: false,
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  })

  const openModal = () => {
    setState({...state, isModalOpen: true, errorMessage: ""});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state.minimumContribution);
    setState({...state, loading: true})
    try {

      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(state.minimumContribution)
        .send({
          from: accounts[0],
      });

      setState({...state, isModalOpen: false})

    } catch(err) {
      setState({...state, errorMessage: err.message})
    }
    setState({...state, loading: false})
  }

  useEffect(() => {
    const renderCampaigns = async () => {
      const numOfCampaigns = props.length;

      const summaries = await Promise.all(
        Array(Number(numOfCampaigns)).fill().map((c, i) => {
            const campaign = Campaign(props[i]);
            return campaign.methods.getSummary().call();
        })
      );
      setState({...state, summaries: summaries})

      // const list = props.map((address) => {
      //   return {
      //     header: address,
      //     meta: 100,
      //     description: (
      //       <Link href={`/campaigns/${address}`}>
      //         View Campaign
      //       </Link>
      //     ),
      //     fluid: true
      //   }
      // });
      // setState({...state, items: list});
    }
    renderCampaigns();
  }, [])

  return (
    <>
      <Topbar openModal={openModal}/>
      
      <Container style={{margin: '40px'}}>
        <Typography variant='h5' component='h3' mb={2}>OPEN CAMPAIGNS</Typography>
        <Container sx={{display: "flex", justifyContent: "center", alignItems: "center", margin: "40px"}}>
        <Grid container spacing={5}>
          {
            state.summaries.map((element, i) => {
              return (
                <Grid key={i} item xs={10} md={4}>
                  <Card 
                    key={i}
                    campaignAddress={props[i]}
                    campaignManager={element[4]}
                    minContribution={Number(element[0])}
                    numRequests={Number(element[2])}
                    numContributors={Number(element[3])}
                  />
                </Grid>
              )
            })
          }
        </Grid>
        </Container>

      <Modal
      closeIcon
      dimmer='blurring'
      open={state.isModalOpen}
      onClose={() => setState({...state, isModalOpen: false})}
      >
      <Modal.Header>Create a new Campaign</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit} error={!!state.errorMessage}>
          <Form.Field></Form.Field>
            <Input 
              label="wei" 
              labelPosition='right' 
              placeholder="Minimum contribution" 
              value={state.minimumContribution}
              onChange={(e) => {
                setState({...state, minimumContribution: e.target.value})
              }}
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
Index.getInitialProps = async() => {
    const campaigns = await factory.methods.getCampaigns().call();
    return {props: campaigns};
}
export default Index


//getInitialProps is a static method  --> It's called as a property of the page component instead of a method within it
//It will run both on server side and on client side
//It's automatically called by NextJS when the page is loaded and it populates the props of the component before rendering it


// import { useRouter } from 'next/navigation'
 
// const router = useRouter()
 
// router.push('/dashboard', { scroll: false })