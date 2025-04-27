import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-scroll';

const navItems = ['home', 'about', 'skill', 'project', 'contact'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Ajith Kumar
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <Link
              to={item}
              spy
              smooth
              offset={-70}
              duration={500}
              onClick={handleDrawerToggle}
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <ListItem button component="div">
                <ListItemText primary={item.charAt(0).toUpperCase() + item.slice(1)} />
              </ListItem>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#f2f2f2',
          width: '98%',
          justifyContent:'center',
          margin: '8px auto 0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#0a192f' }}>
            Ajith Kumar
          </Typography>
          {isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: '#0a192f',
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.7,
                },
              }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  activeClass="active"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    sx={{
                      color: '#0a192f',
                      textTransform: 'capitalize',
                      position: 'relative',
                      fontWeight: 'normal',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        fontWeight: 'bold',
                        '&::after': {
                          width: '100%',
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: 4,
                        height: '2px',
                        width: 0,
                        backgroundColor: '#000',
                        transition: 'width 0.3s ease',
                      },
                      '&.active': {
                        fontWeight: 'bold',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                    className="nav-link"
                  >
                    {item}
                  </Button>
                </Link>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            backgroundColor: '#fff',
            borderRadius: '10px 0 0 10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
