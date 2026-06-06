// src/pages/Home.jsx
import { Container, Box, Typography } from '@mui/material'
import { usePosts } from '../context/PostContext'
import PostCard from '../components/PostCard'
import LoadingSkeleton from '../components/LoadingSkeleton'

const Home = () => {
  const { feedPosts, loading, deletePost } = usePosts()

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <LoadingSkeleton />
        <LoadingSkeleton />
      </Container>
    )
  }

  if (feedPosts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No posts to show
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Follow some users or create your first post!
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {feedPosts.map(post => (
        <PostCard key={post.id} post={post} onDelete={deletePost} />
      ))}
    </Container>
  )
}

export default Home