import { Link } from 'react-router-dom'
import { Shirt, Sparkles, CalendarDays, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Shirt className="text-[var(--accent-wood-dark)]" size={32} />
          <span className="text-xl font-bold text-[var(--text-primary)]">eWardrobe</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign In
          </Link>
          <Link 
            to="/login" 
            className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Your Wardrobe,{' '}
            <span className="text-[var(--accent-wood-dark)]">
              Reimagined
            </span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Upload your clothes, get smart outfit suggestions, and plan your looks for the entire week.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-primary)] text-white font-semibold rounded-xl hover:bg-[var(--brand-primary-hover)] transition-colors shadow-lg"
          >
            Start Free
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-12 h-12 bg-[var(--accent-wood-light)] rounded-xl flex items-center justify-center mb-4">
              <Shirt className="text-[var(--accent-wood-dark)]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Digital Wardrobe</h3>
            <p className="text-[var(--text-secondary)]">Upload and organize all your clothing items in one place.</p>
          </div>
          
          <div className="p-6 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-12 h-12 bg-[var(--brand-primary)]/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="text-[var(--brand-primary)]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Smart Suggestions</h3>
            <p className="text-[var(--text-secondary)]">Get personalized outfit recommendations for any occasion.</p>
          </div>
          
          <div className="p-6 bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)]">
            <div className="w-12 h-12 bg-[var(--accent-wood)]/20 rounded-xl flex items-center justify-center mb-4">
              <CalendarDays className="text-[var(--accent-wood-dark)]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Weekly Planner</h3>
            <p className="text-[var(--text-secondary)]">Plan your outfits for the week ahead of time.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
