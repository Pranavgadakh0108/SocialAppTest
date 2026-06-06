// src/components/LoadingSkeleton.jsx
import { Skeleton, Card, CardContent, CardMedia, Box } from '@mui/material'

const LoadingSkeleton = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height={400} />
      <CardContent>
        <Skeleton variant="text" width={100} height={32} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
      </CardContent>
    </Card>
  )
}

export default LoadingSkeleton