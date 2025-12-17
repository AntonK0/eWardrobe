import { useState } from 'react'
import { Heart, X, RotateCcw } from 'lucide-react'

export default function Suggestions() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // TODO: Replace with real outfit suggestions from your backend
  const outfits = [
    { id: 1, name: 'Casual Friday', items: ['White T-Shirt', 'Blue Jeans', 'Sneakers'] },
    { id: 2, name: 'Date Night', items: ['Black Shirt', 'Chinos', 'Dress Shoes'] },
    { id: 3, name: 'Weekend Chill', items: ['Hoodie', 'Joggers', 'Sneakers'] },
  ]

  const currentOutfit = outfits[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // TODO: Save this outfit
      console.log('Saved outfit:', currentOutfit)
    }
    
    if (currentIndex < outfits.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
  }

  if (currentIndex >= outfits.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">No more suggestions!</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)]"
        >
          <RotateCcw size={20} />
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Outfit Suggestions</h1>
      <p className="text-[var(--text-secondary)] mb-8">Swipe right to save, left to skip</p>

      {/* Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-[var(--surface-card)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-lg">
          {/* Outfit Preview */}
          <div className="aspect-[3/4] bg-gradient-to-br from-[var(--accent-wood-light)] to-[var(--accent-wood)]/30 flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{currentOutfit.name}</h2>
              <div className="space-y-2">
                {currentOutfit.items.map((item, idx) => (
                  <p key={idx} className="text-[var(--text-secondary)]">{item}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-6 p-6 bg-[var(--bg-secondary)]">
            <button
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--error)] flex items-center justify-center hover:bg-[var(--error)]/10 transition-colors"
            >
              <X size={32} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              className="w-20 h-20 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center hover:bg-[var(--brand-primary-hover)] transition-colors shadow-lg"
            >
              <Heart size={36} />
            </button>
          </div>
        </div>

        <p className="text-center text-[var(--text-muted)] mt-4">
          {currentIndex + 1} of {outfits.length}
        </p>
      </div>
    </div>
  )
}
