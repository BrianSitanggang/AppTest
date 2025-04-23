// pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api'
import { PageContainer, InputField, Button } from '../components/FormControls'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post('/login', { username, password })
      localStorage.setItem('token', res.data.access_token)
      window.dispatchEvent(new Event('auth-change')) 
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <PageContainer title="Login">
      <div className="flex flex-col items-center">
        <div className="w-80 mb-4">
          <InputField
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="w-80 mb-4">
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <p className="text-red-500 text-sm text-center ">
          {error}
        </p>
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </PageContainer>
  )
}
