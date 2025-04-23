// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from '../api'

export default function Navbar() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.get('/profile')
        .then(res => setUsername(res.data.username))
        .catch(() => setUsername(''))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.dispatchEvent(new Event('auth-change')) 
    window.location.href = '/'
  }

  return (
    <nav className="bg-gray-100 border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3 text-sm">
        <Link to="/" className="text-lg font-bold text-gray-800" onClick={() => {
          setShowCreatePost(false)
          setSelectedPost(null)
        }}>WishBridge</Link>

        {!username ? (
          <div className="flex justify-between items-center w-40">
            <Link to="/login" className="text-blue-600 hover:underline text-left w-1/2">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline text-right w-1/2">Register</Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, <span className="font-semibold">{username}</span>
            </span>
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}