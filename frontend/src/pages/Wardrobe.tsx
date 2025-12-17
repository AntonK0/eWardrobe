import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ClothingCard from '../components/ClothingCard'

export default function Wardrobe() {
  // TODO: Replace with real data from your backend
  const clothes = [
    { id: 1, name: 'White T-Shirt', category: 'Tops', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'Blue Jeans', category: 'Bottoms', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'Black Jacket', category: 'Outerwear', image: 'https://via.placeholder.com/300' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Wardrobe</h1>
          <p className="text-[var(--text-secondary)] mt-1">{clothes.length} items</p>
        </div>
        <Link
          to="/add"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
        >
          <Plus size={20} />
          Add Clothing
        </Link>
      </div>

      {/* Clothing Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clothes.map((item) => (
          <ClothingCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {clothes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)] mb-4">Your wardrobe is empty</p>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            <Plus size={20} />
            Add Your First Item
          </Link>
        </div>
      )}
    </div>
  )
}
