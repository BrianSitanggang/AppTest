// pages/Register.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api'
import { PageContainer, InputField, Button } from '../components/FormControls'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await axios.post('/register', { username, password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <PageContainer title="Register">
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
        <p className="text-red-500 text-sm text-center min-h-[0.75rem] mb-2 w-80 mx-auto">
          {error}
        </p>
        <div className="w-80">
          <Button onClick={handleRegister} className="px-6 w-full bg-green-600 hover:bg-green-700">Register</Button>
        </div>
        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 underline">
            Login here
          </Link>
        </p>
      </div>
    </PageContainer>
  )
}