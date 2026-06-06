// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider
} from '@mui/material'
import { Edit, Delete, Close } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useFollow } from '../context/FollowContext'
import { usePosts } from '../context/PostContext'
import axios from '../api/axios'

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, updateUser, deleteUser } = useAuth()
  const { followUser, unfollowUser, isFollowing } = useFollow()
  const { posts, loadPosts } = usePosts()
  const [user, setUser] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [userPosts, setUserPosts] = useState([])

  const isOwnProfile = currentUser?.id === id
  const following = isFollowing(id)

  useEffect(() => {
    loadUser()
    loadPosts()
  }, [id, currentUser])

  useEffect(() => {
    if (posts.length > 0) {
      setUserPosts(posts.filter(post => post.userId === id))
    }
  }, [posts, id])

  const loadUser = async () => {
    const users = (await axios.get('/users')).data
    const foundUser = users.find(u => u.id === id)
    if (foundUser) {
      setUser(foundUser)
      setEditForm(foundUser)
    } else {
      navigate('/home')
    }
  }

  const handleFollowToggle = async () => {
    if (following) {
      await unfollowUser(id)
    } else {
      await followUser(id)
    }
    await loadUser()
  }

  const handleUpdateProfile = async () => {
    await updateUser(editForm)
    setEditDialogOpen(false)
    await loadUser()
  }

  const handleDeleteAccount = async () => {
    await deleteUser()
    navigate('/login')
  }

  if (!user) return null

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
          <Avatar src={user.profileImageUrl} sx={{ width: 120, height: 120 }} />
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" gutterBottom>
              {user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {user.fullName}
            </Typography>
            {user.bio && (
              <Typography variant="body2" paragraph>
                {user.bio}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
              <Chip label={`${userPosts.length} posts`} />
              <Chip label={`${user.followers?.length || 0} followers`} />
              <Chip label={`${user.following?.length || 0} following`} />
            </Box>
            
            {isOwnProfile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditDialogOpen(true)}>
                  Edit Profile
                </Button>
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)}>
                  Delete Account
                </Button>
              </Box>
            ) : (
              <Button
                variant={following ? 'outlined' : 'contained'}
                onClick={handleFollowToggle}
              >
                {following ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Posts
      </Typography>
      
      {userPosts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No posts yet</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {userPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/edit-post/${post.id}`)}>
                <CardMedia component="img" height="200" image={post.imageUrl} alt={post.caption} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.fullName || ''}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Bio"
            value={editForm.bio || ''}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Profile Image URL"
            value={editForm.profileImageUrl || ''}
            onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Profile