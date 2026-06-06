// src/components/Sidebar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  Home,
  Person,
  AddBox,
  Search,
  People,
  Logout
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, currentUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/home' },
    { text: 'Profile', icon: <Person />, path: `/profile/${currentUser?.id}` },
    { text: 'Create Post', icon: <AddBox />, path: '/create-post' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Following', icon: <People />, path: '/following' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <Typography variant="h6" sx={{ mb: 3, px: 2, fontWeight: 'bold' }}>
        SocialConnect
      </Typography> */}

      <img src="amigos.png" alt="" height={150} width={150}/>
      
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  const drawerWidth = 280

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth }
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar