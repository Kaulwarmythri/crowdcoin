import { AppBar, Container, Toolbar, Typography, styled, alpha, InputBase, Box, ThemeProvider, createTheme, IconButton, Button} from '@mui/material'
import React from 'react'
import { CurrencyExchange, Search, AddCircle, CloudUpload } from '@mui/icons-material'
import Link from 'next/link';

const SearchDiv = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));

const theme = createTheme({
  spacing: 12,
});

const Navbar = ({openModal}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <ThemeProvider theme={theme}>
        <AppBar position="sticky" variant='dense' sx={{background: "black"}}>
            <Toolbar spacing={4}>
            <CurrencyExchange sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }} color='secondary'/>
            <Typography
                variant="h6"
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                mr: 8,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                CROWDCOIN
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <SearchDiv>
                <SearchIconWrapper>
                    <Search color='secondary'/>
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search for campaigns..."  inputProps={{ 'aria-label': 'search' }}/>
            </SearchDiv>
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton color="success" aria-label="create campaign" size='large' onClick={openModal}>
                <AddCircle sx={{ml: 8, mr:2}} fontSize='large' color='success'/>
            </IconButton>
            </Toolbar>
        </AppBar>
        </ThemeProvider>
    </Box>
  )
}

export default Navbar