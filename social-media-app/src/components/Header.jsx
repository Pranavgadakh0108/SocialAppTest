// src/components/Header.jsx
import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  TextField,
  InputAdornment,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel
} from '@mui/material'
import { Search, Notifications, DarkMode, LightMode } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { currentUser, logout, darkMode, setDarkMode } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    handleMenuClose()
  }

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/home')}
        >
          Amigos
        </Typography>
        
        {!isMobile && currentUser && (
          <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Box>
        )}
        
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  icon={<LightMode />}
                  checkedIcon={<DarkMode />}
                />
              }
              label=""
            />
            
            <IconButton>
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={currentUser.profileImageUrl} sx={{ width: 32, height: 32 }} />
            </IconButton>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { navigate(`/profile/${currentUser.id}`); handleMenuClose() }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/create-post'); handleMenuClose() }}>
                Create Post
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      
      {isMobile && currentUser && (
        <Box sx={{ p: 1, pb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }
              }}
            />
          </form>
        </Box>
      )}
    </AppBar>
  )
}

export default Header