import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
// ...

function App() {
  const [authKey, setAuthKey] = useState(0)

  useEffect(() => {
    const listener = () => setAuthKey(k => k + 1)
    window.addEventListener('auth-change', listener)
    return () => window.removeEventListener('auth-change', listener)
  }, [])

  return (
    <>
      <Navbar key={authKey} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* other pages */}
      </Routes>
    </>
  )
}

export default App
