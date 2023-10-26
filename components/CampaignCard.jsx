import { AspectRatio, Box, Card, CardContent, Sheet, Typography } from '@mui/joy'
import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import Router, { useRouter } from 'next/router'

const CampaignCard = ({campaignAddress, campaignManager, minContribution, numRequests, numContributors}) => {
  const router = useRouter();
  return (
    <Card
        orientation="horizontal"
        sx={{
          width: '100%',
          flexWrap: 'wrap',
          [`& > *`]: {
            '--stack-point': '500px',
            minWidth:
              'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
          },
          // make the card resizable for demo
          overflow: 'auto',
          resize: 'horizontal',
        }}
      >
        <CardContent>
          <Typography fontSize="l" fontWeight="lg" noWrap>
            Campaign : {campaignAddress}
          </Typography>
          <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary" noWrap>
            Manager : {campaignManager}
          </Typography>
          <Sheet
            sx={{
              bgcolor: 'background.level1',
              borderRadius: 'sm',
              p: 1.5,
              my: 1.5,
              display: 'flex',
              gap: 2,
              '& > div': { flex: 1 },
            }}
          >
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Minimum (ETH)
              </Typography>
              <Typography fontWeight="lg">{minContribution}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Requests
              </Typography>
              <Typography fontWeight="lg">{numRequests}</Typography>
            </div>
            <div>
              <Typography level="body-xs" fontWeight="lg">
                Backers
              </Typography>
              <Typography fontWeight="lg">{numContributors}</Typography>
            </div>
          </Sheet>
          <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
            <Button variant="contained" color="secondary" onClick={() => router.push(`/campaigns/${campaignAddress}/requests`)}>
                
                    View Requests
            </Button>
          </Box>
        </CardContent>
      </Card>
  )
}

export default CampaignCard