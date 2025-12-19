import { NavLink } from 'react-router-dom'
import { Shirt, Plus, Sparkles, CalendarDays, Settings, Heart } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

const navItems = [
  { path: '/wardrobe', icon: Shirt, label: 'Wardrobe' },
  { path: '/add', icon: Plus, label: 'Add Clothes' },
  { path: '/outfits', icon: Heart, label: 'Saved Outfits' },
  { path: '/suggestions', icon: Sparkles, label: 'Suggestions' },
  { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user } = useAuth0()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--surface-card)] border-r border-[var(--border-subtle)] p-4 flex flex-col">
      {/* Logo */}
      <NavLink to="/wardrobe" className="flex items-center gap-2 mb-8 px-2">
        <Shirt className="text-[var(--accent-wood-dark)]" size={32} />
        <span className="text-xl font-bold text-[var(--text-primary)]">eWardrobe</span>
      </NavLink>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      <div className="mt-auto pt-4 border-t border-[var(--divider)]">
        <NavLink 
          to="/settings" 
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={user.name || 'Profile'} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-wood-light)] to-[var(--accent-wood)]" />
          )}
          <div>
            <p className="text-sm text-[var(--text-primary)] font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-muted)]">{user?.email || ''}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
