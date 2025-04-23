// pages/Home.jsx
import { useEffect, useState } from 'react'
import axios from '../api'
import Post from '../components/Post'
import {
    PostList,
    CreatePost,
    CommentBox,
    CommentList,
  } from '../components/FormControls'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [commentRefreshKey, setCommentRefreshKey] = useState(0)
  const [comments, setComments] = useState([])
  const [usernames, setUsernames] = useState({})
  
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts')
      setPosts(res.data)
    } catch (err) {
      console.error('Failed to fetch posts:', err.response?.data || err.message)
    }
  }

  const handleVote = async (id, type) => {
    await axios.post(`/posts/${id}/vote`, { type })
    fetchPosts()
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (!selectedPost) return
  
    const fetchComments = async () => {
      const res = await axios.get(`/posts/${selectedPost.ID}/comments`)
      setComments(res.data)
  
      const ids = [...new Set(res.data.map(c => c.UserID))]
      const map = {}
      await Promise.all(ids.map(async id => {
        try {
          const r = await axios.get(`/profile?id=${id}`)
          map[id] = r.data.username
        } catch {
          map[id] = 'Unknown'
        }
      }))
      setUsernames(map)
    }
  
    fetchComments()
  }, [selectedPost, commentRefreshKey])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
        <PostList
        posts={posts}
        onSelect={post => {
            setSelectedPost(post)
            setShowCreatePost(false)
        }}
        onCreateToggle={() => setShowCreatePost(!showCreatePost)}
        showCreate={showCreatePost}
        selectedPost={selectedPost}
        />

      {(showCreatePost || selectedPost) && (
        <div className="flex-1 p-4 overflow-y-auto">
          {showCreatePost ? (
            <CreatePost onPostCreated={() => {
                fetchPosts()
                setShowCreatePost(false)
              }} />
          ) : (
            selectedPost && (
              <>
                <Post post={selectedPost} onVote={handleVote} />
                <CommentList comments={comments} usernames={usernames} />
                <CommentBox postId={selectedPost.ID} onCommented={() => setCommentRefreshKey(k => k + 1)}
/>

              </>
            )
          )}
        </div>
      )}
    </div>
  )
}

