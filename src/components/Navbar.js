import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = ['home', 'about', 'project', 'contact'];

const menuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuClick = (event) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#f2f2f2',
          width: '98%',
          justifyContent: 'center',
          margin: '8px auto 0',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1300,
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#0a192f' }}>
            Ajith Kumar
          </Typography>

          {isMobile ? (
            <>
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    color: '#0a192f',
                    zIndex: 1400,
                  }}
                >
                  {open ? (
                    <motion.div
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CloseIcon />
                    </motion.div>
                  ) : (
                    <MenuIcon />
                  )}
                </IconButton>
              </motion.div>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose} // This will close the menu when clicked outside
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    px: 2,
                    width: 250,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={menuVariants}
                    >
                      {navItems.map((item) => (
                        <motion.div key={item} variants={itemVariants}>
                          <MenuItem
                            onClick={() => {
                              handleMenuClose(); // Close menu when item is clicked
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                                fontWeight: 'bold',
                              },
                            }}
                          >
                            <Link
                              to={item}
                              spy
                              smooth
                              offset={-40}
                              duration={500}
                              style={{
                                textDecoration: 'none',
                                color: '#0a192f',
                                width: '100%',
                                display: 'block',
                                textTransform: 'capitalize',
                              }}
                            >
                              {item}
                            </Link>
                          </MenuItem>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item}
                  spy
                  smooth
                  offset={-40}
                  duration={500}
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
                    }}
                  >
                    {item}
                  </Button>
                </Link>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
