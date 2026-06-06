// src/components/MobileBottomNav.jsx
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { Home, Person, AddBox, Search, People } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MobileBottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  const getValue = () => {
    if (location.pathname === '/home') return 0
    if (location.pathname === `/profile/${currentUser?.id}`) return 1
    if (location.pathname === '/create-post') return 2
    if (location.pathname === '/search') return 3
    if (location.pathname === '/following') return 4
    return 0
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', sm: 'none' }
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getValue()}
        onChange={(event, newValue) => {
          switch(newValue) {
            case 0: navigate('/home'); break
            case 1: navigate(`/profile/${currentUser?.id}`); break
            case 2: navigate('/create-post'); break
            case 3: navigate('/search'); break
            case 4: navigate('/following'); break
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
        <BottomNavigationAction label="Create" icon={<AddBox />} />
        <BottomNavigationAction label="Search" icon={<Search />} />
        <BottomNavigationAction label="Following" icon={<People />} />
      </BottomNavigation>
    </Paper>
  )
}

export default MobileBottomNav