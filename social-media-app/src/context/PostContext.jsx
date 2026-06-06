// src/context/PostContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'
import { useAuth } from './AuthContext'

const PostContext = createContext()

export const usePosts = () => useContext(PostContext)

export const PostProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [feedPosts, setFeedPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      loadPosts()
    }
  }, [currentUser])

  const loadPosts = async () => {
    setLoading(true)
    const allPosts = (await axios.get('/posts')).data
    setPosts(allPosts)
    if (currentUser) {
      const following = currentUser.following || []
      const feed = allPosts
        .filter(post => post.userId === currentUser.id || following.includes(post.userId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setFeedPosts(feed)
    }
    setLoading(false)
  }

  const createPost = async (postData) => {
    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userAvatar: currentUser.profileImageUrl,
      username: currentUser.username,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      ...postData
    }
    
    const allPosts = (await axios.get('/posts')).data
    await axios.post('/posts', [...allPosts, newPost])
    await loadPosts()
    return newPost
  }

  const updatePost = async (postId, updatedData) => {
    const allPosts = (await axios.get('/posts')).data
    const updatedPosts = allPosts.map(post => 
      post.id === postId ? { ...post, ...updatedData } : post
    )
    await axios.post('/posts', updatedPosts)
    await loadPosts()
  }

  const deletePost = async (postId) => {
    const allPosts = (await axios.get('/posts')).data
    const filteredPosts = allPosts.filter(post => post.id !== postId)
    await axios.post('/posts', filteredPosts)
    await loadPosts()
  }

  const likePost = async (postId) => {
    const allPosts = (await axios.get('/posts')).data
    const postIndex = allPosts.findIndex(p => p.id === postId)
    const post = allPosts[postIndex]
    
    if (post.likes.includes(currentUser.id)) {
      post.likes = post.likes.filter(id => id !== currentUser.id)
    } else {
      post.likes.push(currentUser.id)
    }
    
    allPosts[postIndex] = post
    await axios.post('/posts', allPosts)
    await loadPosts()
  }

  const addComment = async (postId, commentText) => {
    const allPosts = (await axios.get('/posts')).data
    const postIndex = allPosts.findIndex(p => p.id === postId)
    const post = allPosts[postIndex]
    
    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.profileImageUrl,
      text: commentText,
      createdAt: new Date().toISOString()
    }
    
    post.comments.push(newComment)
    allPosts[postIndex] = post
    await axios.post('/posts', allPosts)
    await loadPosts()
  }

  const deleteComment = async (postId, commentId) => {
    const allPosts = (await axios.get('/posts')).data
    const postIndex = allPosts.findIndex(p => p.id === postId)
    const post = allPosts[postIndex]
    post.comments = post.comments.filter(c => c.id !== commentId)
    allPosts[postIndex] = post
    await axios.post('/posts', allPosts)
    await loadPosts()
  }

  const getUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId)
  }

  // Add this function to refresh feed after follow/unfollow
  const refreshFeed = async () => {
    if (currentUser) {
      await loadPosts()
    }
  }

  return (
    <PostContext.Provider value={{
      posts,
      feedPosts,
      loading,
      createPost,
      updatePost,
      deletePost,
      likePost,
      addComment,
      deleteComment,
      getUserPosts,
      loadPosts,
      refreshFeed  // Add this to the context value
    }}>
      {children}
    </PostContext.Provider>
  )
}