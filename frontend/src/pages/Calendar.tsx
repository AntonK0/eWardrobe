import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  // TODO: Replace with real planned outfits from your backend
  const plannedOutfits: Record<string, string | null> = {
    Monday: 'Casual Friday',
    Tuesday: null,
    Wednesday: 'Business Casual',
    Thursday: null,
    Friday: 'Weekend Vibes',
    Saturday: null,
    Sunday: null,
  }

  const spinWheel = () => {
    setIsSpinning(true)
    const randomDay = Math.floor(Math.random() * 7)
    
    setTimeout(() => {
      setSelectedDay(randomDay)
      setIsSpinning(false)
    }, 1000)
  }

  const goToPrevDay = () => {
    setSelectedDay((prev) => (prev === 0 ? 6 : prev - 1))
  }

  const goToNextDay = () => {
    setSelectedDay((prev) => (prev === 6 ? 0 : prev + 1))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Weekly Planner</h1>
      <p className="text-[var(--text-secondary)] mb-8">Plan your outfits for the week</p>

      {/* Day Selector */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={goToPrevDay}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          className={`
            w-48 h-48 rounded-full bg-gradient-to-br from-[var(--accent-wood-light)] to-[var(--accent-wood)]
            flex items-center justify-center cursor-pointer shadow-lg
            ${isSpinning ? 'animate-spin' : ''}
          `}
          onClick={spinWheel}
        >
          <div className="w-40 h-40 rounded-full bg-[var(--surface-card)] flex items-center justify-center shadow-inner">
            <span className="text-2xl font-bold text-[var(--text-primary)] text-center">
              {DAYS[selectedDay]}
            </span>
          </div>
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <p className="text-center text-[var(--text-muted)] mb-8">Click the wheel to spin!</p>

      {/* Planned Outfit */}
      <div className="max-w-md mx-auto bg-[var(--surface-card)] rounded-2xl p-6 border border-[var(--border-subtle)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          {DAYS[selectedDay]}'s Outfit
        </h3>

        {plannedOutfits[DAYS[selectedDay]] ? (
          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
            <p className="text-[var(--text-primary)] font-medium">{plannedOutfits[DAYS[selectedDay]]}</p>
          </div>
        ) : (
          <div className="p-4 bg-[var(--bg-secondary)] rounded-xl text-center">
            <p className="text-[var(--text-muted)]">No outfit planned</p>
            <button className="mt-2 text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium">
              + Add outfit
            </button>
          </div>
        )}
      </div>

      {/* Week Overview */}
      <div className="mt-8 grid grid-cols-7 gap-2">
        {DAYS.map((day, idx) => (
          <button
            key={day}
            onClick={() => setSelectedDay(idx)}
            className={`
              p-2 rounded-lg text-center transition-colors border
              ${idx === selectedDay 
                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]' 
                : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-wood)]'}
            `}
          >
            <span className="block text-xs">{day.slice(0, 3)}</span>
            <span className="block text-lg mt-1">
              {plannedOutfits[day] ? '✓' : '·'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
