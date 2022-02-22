import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useAuthenticationContext } from "../context/AuthenticationContext";
import './Navigation.css';
import '../App.css';

function UserManagement() {
  const { authenticated, setAuthenticating, handleSignOut } = useAuthenticationContext();
  if (authenticated) {
    return <div id="user-management">
      <Button variant='contained' onClick={handleSignOut}>注销</Button>
    </div>
  } else {
    return <Button variant='contained' onClick={() => setAuthenticating(true)}>登录</Button>
  }
}

const pages = [
  { id: 'AnimeList', label: '补番列表' },
  { id: 'NewAnimeList', label: '追番列表' },
  { id: 'MonthlySummary', label: '每月总结' },
  { id: 'SeasonalSummary', label: '季度总结' },
  { id: 'GameList', label: '游戏列表'},
];

function Navigation(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const res = <AppBar position="static" id="navbar">
    <Container maxWidth="xl" id="navbar-container">
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}
        >
          追番补番列表
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
          <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page.id}
                onClick={() => {
                  handleCloseNavMenu()
                  props.switchPage(page.id)
                }}
              >
                <Typography textAlign="center">{page.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
        >
          追番补番列表
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Button
              key={page.id}
              onClick={() => {
                handleCloseNavMenu()
                props.switchPage(page.id)
              }}
              sx={{ my: 2, color: 'black', display: 'block' }}
            >
              {page.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
      <UserManagement />
    </Container>
  </AppBar>

  return res;
}

export default Navigation;
