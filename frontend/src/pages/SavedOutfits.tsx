import { Plus, Heart, Trash2 } from 'lucide-react'

interface Outfit {
  id: number
  name: string
  items: { id: number; image: string; name: string }[]
  createdAt: string
}

export default function SavedOutfits() {
  // TODO: Replace with real data from your backend
  const outfits: Outfit[] = [
    {
      id: 1,
      name: 'Casual Friday',
      items: [
        { id: 1, image: 'https://via.placeholder.com/150', name: 'White T-Shirt' },
        { id: 2, image: 'https://via.placeholder.com/150', name: 'Blue Jeans' },
        { id: 3, image: 'https://via.placeholder.com/150', name: 'White Sneakers' },
      ],
      createdAt: '2024-12-15',
    },
    {
      id: 2,
      name: 'Business Meeting',
      items: [
        { id: 4, image: 'https://via.placeholder.com/150', name: 'Blue Oxford Shirt' },
        { id: 5, image: 'https://via.placeholder.com/150', name: 'Black Chinos' },
        { id: 6, image: 'https://via.placeholder.com/150', name: 'Brown Loafers' },
      ],
      createdAt: '2024-12-14',
    },
    {
      id: 3,
      name: 'Weekend Vibes',
      items: [
        { id: 7, image: 'https://via.placeholder.com/150', name: 'Hoodie' },
        { id: 8, image: 'https://via.placeholder.com/150', name: 'Joggers' },
      ],
      createdAt: '2024-12-10',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Saved Outfits</h1>
          <p className="text-[var(--text-secondary)] mt-1">{outfits.length} outfits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors">
          <Plus size={20} />
          Create Outfit
        </button>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} />
        ))}
      </div>

      {/* Empty State */}
      {outfits.length === 0 && (
        <div className="text-center py-20">
          <Heart className="mx-auto text-[var(--text-muted)] mb-4" size={48} />
          <p className="text-[var(--text-muted)] mb-4">No saved outfits yet</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors">
            <Plus size={20} />
            Create Your First Outfit
          </button>
        </div>
      )}
    </div>
  )
}

function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <div className="bg-[var(--surface-card)] rounded-xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:shadow-lg transition-all">
      {/* Outfit Preview Grid */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-[var(--bg-secondary)]">
        {outfit.items.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={`aspect-square rounded-lg overflow-hidden ${
              outfit.items.length === 1 ? 'col-span-3' : 
              outfit.items.length === 2 && index === 0 ? 'col-span-2 row-span-1' : ''
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {outfit.items.length > 3 && (
          <div className="aspect-square rounded-lg bg-[var(--surface-card)] flex items-center justify-center">
            <span className="text-[var(--text-muted)] text-sm font-medium">
              +{outfit.items.length - 3}
            </span>
          </div>
        )}
      </div>

      {/* Outfit Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold">{outfit.name}</h3>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              {outfit.items.length} items • {new Date(outfit.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-1">
            <button className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <Heart size={18} />
            </button>
            <button className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Item Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {outfit.items.slice(0, 3).map((item) => (
            <span
              key={item.id}
              className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs rounded-md"
            >
              {item.name}
            </span>
          ))}
          {outfit.items.length > 3 && (
            <span className="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs rounded-md">
              +{outfit.items.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
