import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./api/authApi"
import { login, logout } from "./store/authSlice"
import { Footer, Header, AuthModal } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  return !loading ? (
    <div className='min-h-screen bg-stone-50 text-slate-950'>
      <div className='flex min-h-screen flex-col'>
        <Header />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* Global auth modal — rendered outside the page tree so it overlays everything */}
      <AuthModal />
    </div>
  ) : null
}

export default App
