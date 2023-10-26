import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({openModal}) => {
  const router = useRouter();
  return (
    <Container style={{margin: '20px'}}>
      <Menu style={{marginTop: '10px', display: 'flex', alignItems: 'center'}}>
        <Link href='/' className={router.pathname == "/" ? "active" : ""}  style={{marginLeft: '10px'}}>
            CrowdCoin
        </Link>
        <Menu.Menu position='right' style={{display: 'flex', alignItems: 'center'}}>
            <Link href='/' className={router.pathname == "/" ? "active" : ""} style={{marginRight: '10px'}}>
                Campaigns
            </Link>
            
            <Link href='/' className={router.pathname == "/" ? "active" : ""} style={{marginRight: '10px'}}>
              <Button circular icon='plus' color='blue' onClick={openModal}/>
            </Link>
        </Menu.Menu>
      </Menu>
    </Container>
  )
}

export default Layout