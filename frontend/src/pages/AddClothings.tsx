import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AddClothings() {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null as File | null
  })

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send to your backend
    console.log('Submitting:', formData)
    navigate('/wardrobe')
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, image: e.dataTransfer.files[0] })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/wardrobe"
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Add Clothing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
            ${dragActive 
              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' 
              : 'border-[var(--border-subtle)] hover:border-[var(--accent-wood)]'}
          `}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && setFormData({ ...formData, image: e.target.files[0] })}
          />
          <Upload className="mx-auto text-[var(--text-muted)] mb-4" size={48} />
          <p className="text-[var(--text-primary)] font-medium">
            {formData.image ? formData.image.name : 'Drop your image here'}
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-1">or click to browse</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--surface-card)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            placeholder="e.g., Blue Oxford Shirt"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors border
                  ${formData.category === cat
                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                    : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-wood)] hover:text-[var(--text-primary)]'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors"
        >
          Add to Wardrobe
        </button>
      </form>
    </div>
  )
}
