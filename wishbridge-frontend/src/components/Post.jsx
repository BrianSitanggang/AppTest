// components/Post.jsx
import { useEffect, useState } from 'react'
import axios from '../api'

export default function Post({ post, onVote }) {
    const [author, setAuthor] = useState('')
  
    const fetchAuthor = async () => {
      if (post.UserID) {
        try {
          const res = await axios.get(`/profile?id=${post.UserID}`)
          setAuthor(res.data.username)
        } catch {
          setAuthor('Unknown')
        }
      }
    }
  
    useEffect(() => {
      fetchAuthor()
    }, [post.ID])
  
    return (
      <div className="shadow-sm p-4 mb-4 bg-white rounded">
        <h3 className="font-bold text-lg mb-1">{post.Title}</h3>
        <p className="text-xs text-gray-500 italic mb-2"> Posted by <span className="font-medium text-gray-700">{author || '...'}</span></p>
        <p className="mb-4 text-gray-800 leading-relaxed">{post.Content}</p>
        <div className="flex gap-4">
            <button onClick={() => {onVote(post.ID, 1)
                post.MyVote = 1
            }} className={`text-xl ${post.MyVote === 1 ? 'text-green-600' : 'text-gray-400'} hover:text-green-600`}>
            👍
            </button>

            <button onClick={() => {onVote(post.ID, -1)
                post.MyVote = -1
            }} className={`text-xl ${post.MyVote === -1 ? 'text-red-600' : 'text-gray-400'} hover:text-red-600`}>
            👎
            </button>
        </div>
      </div>
    )
  }