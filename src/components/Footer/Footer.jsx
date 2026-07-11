import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 pt-14 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top row */}
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.5fr]">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Logo width="120px" variant="dark" />
            <p className="max-w-xs text-sm leading-6 text-stone-400">
              A modern blogging platform for writers and readers to connect through stories.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 font-serif text-base font-semibold tracking-tight text-white">
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { label: "All posts",  to: "/posts" },
                { label: "Search",     to: "/search" },
                { label: "Dashboard",  to: "/dashboard" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-stone-400 transition-colors duration-150 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Create */}
          <div>
            <h3 className="mb-5 font-serif text-base font-semibold tracking-tight text-white">
              Create
            </h3>
            <ul className="space-y-3">
              {[
                { label: "New post",     to: "/dashboard/posts/new" },
                { label: "Manage posts", to: "/dashboard/posts" },
                { label: "Profile",      to: "/dashboard/profile" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-stone-400 transition-colors duration-150 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-5 font-serif text-base font-semibold tracking-tight text-white">
              About
            </h3>
            <p className="text-sm leading-7 text-stone-400">
              Blogfolio Journal is a platform for writers to share their stories and readers to discover meaningful content.
            </p>
          </div>
        </div>

        {/* Bottom border + copyright */}
        <div className="mt-12 border-t border-stone-800 pt-6">
          <p className="text-xs tracking-wide text-stone-600">
            © {new Date().getFullYear()} Blogfolio Journal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
