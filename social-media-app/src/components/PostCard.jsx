
import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  Comment,
  Delete,
  Edit,
  MoreVert
} from '@mui/icons-material'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostContext'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth()
  const { likePost, addComment, deleteComment } = usePosts()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const navigate = useNavigate()

  const isLiked = post.likes?.includes(currentUser?.id)
  const isOwner = post.userId === currentUser?.id

  const handleLike = async () => {
    await likePost(post.id)
    setSnackbar({
      open: true,
      message: isLiked ? 'Removed like' : 'Post liked!',
      severity: 'success'
    })
  }

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await addComment(post.id, commentText)
      setCommentText('')
      setSnackbar({
        open: true,
        message: 'Comment added!',
        severity: 'success'
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    await deleteComment(post.id, commentId)
    setSnackbar({
      open: true,
      message: 'Comment deleted!',
      severity: 'success'
    })
  }

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`)
    handleMenuClose()
  }

  const handleDelete = async () => {
    await onDelete(post.id)
    setDeleteDialogOpen(false)
    setSnackbar({
      open: true,
      message: 'Post deleted successfully!',
      severity: 'success'
    })
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={
            <Avatar 
              src={post.userAvatar} 
              onClick={() => navigate(`/profile/${post.userId}`)} 
              sx={{ cursor: 'pointer' }} 
            />
          }
          action={
            isOwner && (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={handleEdit}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Caption
                  </MenuItem>
                  <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
                  </MenuItem>
                </Menu>
              </>
            )
          }
          title={
            <Typography 
              variant="subtitle1" 
              sx={{ fontWeight: 'bold', cursor: 'pointer' }} 
              onClick={() => navigate(`/profile/${post.userId}`)}
            >
              {post.username}
            </Typography>
          }
          subheader={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        />
        
        <CardMedia
          component="img"
          height="400"
          image={post.imageUrl}
          alt={post.caption}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => window.open(post.imageUrl, '_blank')}
        />
        
        <CardActions disableSpacing sx={{ pt: 1 }}>
          <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton onClick={() => setShowComments(!showComments)}>
            <Comment />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
          </Typography>
        </CardActions>
        
        <CardContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{post.username}</strong> {post.caption}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ cursor: 'pointer', mb: 1 }}
            onClick={() => setShowComments(!showComments)}
          >
            View all {post.comments?.length || 0} comments
          </Typography>
          
          {showComments && post.comments?.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Avatar 
                src={comment.userAvatar} 
                sx={{ width: 28, height: 28, mr: 1, mt: 0.5, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${comment.userId}`)}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  <strong 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${comment.userId}`)}
                  >
                    {comment.username}
                  </strong>{' '}
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              {(comment.userId === currentUser?.id || isOwner) && (
                <IconButton size="small" onClick={() => handleDeleteComment(comment.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PostCard