import { useState } from 'react'
import { User, Bell, Palette, LogOut } from 'lucide-react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Settings() {
  const { user, logout } = useAuth0()
  const [notifications, setNotifications] = useState(true)

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Settings</h1>

      {/* Profile Section */}
      <div className="bg-[var(--surface-card)] rounded-2xl p-6 mb-6 border border-[var(--border-subtle)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <User size={20} className="text-[var(--accent-wood-dark)]" />
          Profile
        </h2>
        
        <div className="flex items-center gap-4 mb-4">
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={user.name || 'Profile'} 
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-wood-light)] to-[var(--accent-wood)]" />
          )}
          <div>
            <p className="text-[var(--text-primary)] font-medium">{user?.name || 'User'}</p>
            <p className="text-[var(--text-muted)] text-sm">{user?.email || ''}</p>
          </div>
        </div>

        <button className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] text-sm font-medium">
          Edit Profile
        </button>
      </div>

      {/* Preferences Section */}
      <div className="bg-[var(--surface-card)] rounded-2xl p-6 mb-6 border border-[var(--border-subtle)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Palette size={20} className="text-[var(--accent-wood-dark)]" />
          Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-[var(--text-muted)]" />
              <span className="text-[var(--text-primary)]">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`
                w-12 h-6 rounded-full transition-colors relative
                ${notifications ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-subtle)]'}
              `}
            >
              <span 
                className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow
                  ${notifications ? 'left-7' : 'left-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-[var(--surface-card)] rounded-2xl p-6 mb-6 border border-[var(--border-subtle)]">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">My Photos</h2>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-subtle)]" />
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-[var(--error)]/10 text-[var(--error)] rounded-xl hover:bg-[var(--error)]/20 transition-colors border border-[var(--error)]/20"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  )
}
