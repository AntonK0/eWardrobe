import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { Shirt } from 'lucide-react'

export default function Login() {
  const { loginWithRedirect, isLoading } = useAuth0()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Shirt className="text-[var(--accent-wood-dark)]" size={40} />
          <span className="text-2xl font-bold text-[var(--text-primary)]">eWardrobe</span>
        </Link>

        {/* Card */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-8 border border-[var(--border-subtle)] shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Welcome</h2>
          <p className="text-[var(--text-secondary)] mb-6">Sign in to access your wardrobe</p>

          <button
            onClick={() => loginWithRedirect()}
            disabled={isLoading}
            className="w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>

          <div className="mt-4">
            <button
              onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
              disabled={isLoading}
              className="w-full py-3 bg-transparent text-[var(--brand-primary)] font-semibold rounded-lg border border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors disabled:opacity-50"
            >
              Create Account
            </button>
          </div>
        </div>

        <Link to="/" className="block text-[var(--text-muted)] mt-6 hover:text-[var(--text-primary)]">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
