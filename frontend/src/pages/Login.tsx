import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shirt, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add your authentication logic here
    navigate('/wardrobe')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Shirt className="text-[var(--accent-wood-dark)]" size={40} />
          <span className="text-2xl font-bold text-[var(--text-primary)]">eWardrobe</span>
        </Link>

        {/* Card */}
        <div className="bg-[var(--surface-card)] rounded-2xl p-8 border border-[var(--border-subtle)] shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-[var(--text-secondary)] text-center mb-6">
            {isSignUp ? 'Start organizing your wardrobe' : 'Sign in to your account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[var(--text-secondary)] mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--brand-primary)] hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <Link to="/" className="block text-center text-[var(--text-muted)] mt-6 hover:text-[var(--text-primary)]">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
