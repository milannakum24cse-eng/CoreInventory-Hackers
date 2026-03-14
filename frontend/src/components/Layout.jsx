import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',   icon: '▦' },
  { to: '/products',   label: 'Products',    icon: '⬡' },
  { to: '/categories', label: 'Categories',  icon: '◈' },
  { to: '/suppliers',  label: 'Suppliers',   icon: '◎' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="px-5 py-6 border-b border-border">
          <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            StockFlow
          </h1>
          <p className="text-xs font-mono text-gray-600 mt-0.5 tracking-widest uppercase">IMS v1.0</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-surface2'
                }`
              }
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs font-mono text-gray-700">© 2025 StockFlow</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen bg-bg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
