// components/Comment.jsx
import { useEffect, useState } from 'react'
import axios from '../api'

export default function Comment({ comment }) {
  const [author, setAuthor] = useState('')

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`/profile?id=${comment.UserID}`)
        setAuthor(res.data.username)
      } catch {
        setAuthor('Unknown')
      }
    }
    fetchAuthor()
  }, [comment.UserID])

  return (
    <div className="pt-2 mt-2 text-sm text-gray-700">
      <p>{comment.Text}</p>
      <p className="text-xs text-gray-500">— {author || '...'}</p>
    </div>
  )
}
