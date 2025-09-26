import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useThemeContext } from '../../context/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import MonkeybrainsLogo from '../Branding/MonkeybrainsLogo';
import Footer from '../Layout/Footer';
import AnimatedMonkeys from '../AnimatedMonkeys';
import MonkeyToggle from '../AnimatedMonkeys/MonkeyToggle';

const drawerWidth = 264; // Increased by ~10% for better spacing

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  // const { mode, toggleTheme } = useThemeContext();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Buildings', icon: <BusinessIcon />, path: '/buildings' },
    { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Documents', icon: <DocumentIcon />, path: '/documents' },
    { text: 'Schedule', icon: <ScheduleIcon />, path: '/schedule' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
            <MonkeybrainsLogo variant="compact" size="medium" />
          </Box>
          <Box sx={{ ml: 'auto', minWidth: 'fit-content' }}>
            <ThemeSwitcher size="small" />
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'inherit' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AnimatedMonkeys />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ px: 3, py: 1 }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Dark Mode Toggle */}
          <ThemeSwitcher size="medium" />
          
          {/* Show Monkeys Button */}
          <Box sx={{ ml: 2 }}>
            <MonkeyToggle />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

              <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          <Footer />
        </Box>
    </Box>
  );
};

export default Layout;
