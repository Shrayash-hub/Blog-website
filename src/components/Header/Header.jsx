import {Container, Logo, LogoutBtn} from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { name: 'Home',      slug: "/",                    active: true },
    { name: "Explore",   slug: "/posts",               active: true },
    { name: authStatus ? "Write" : "Login to write", slug: authStatus ? "/dashboard/posts/new" : "/login", active: true },
    { name: "Login",     slug: "/login",               active: !authStatus },
    { name: "Signup",    slug: "/signup",              active: !authStatus },
    { name: "Dashboard", slug: "/dashboard",           active: authStatus },
    { name: "Write",     slug: "/dashboard/posts/new", active: authStatus },
  ]

  return (
    <header className='absolute top-0 z-50 w-full bg-transparent'>
      <Container>
        <nav className='flex h-16 items-center justify-between gap-8 border-b border-white/20 md:h-20'>
          {/* Logo */}
          <Link to='/' className="shrink-0">
            <Logo width='120px' variant="dark" />
          </Link>

          {/* Center nav links */}
          <ul className='hidden flex-1 items-center justify-center gap-8 md:flex'>
            {navItems.slice(0, 3).map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={`rounded border px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                    location.pathname === item.slug
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/40 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side actions */}
          <div className='flex items-center gap-4'>
            {/* Search icon */}
            <button
              onClick={() => navigate('/search')}
              className="text-white/70 transition-colors hover:text-white"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {authStatus ? (
              <>
                {/* User icon */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-white/70 transition-colors hover:text-white"
                  aria-label="Dashboard"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <LogoutBtn />
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="rounded border border-white/40 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                Sign in
              </button>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
