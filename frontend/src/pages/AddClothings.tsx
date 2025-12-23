import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft, Loader2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function AddClothings() {
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()
  
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null as File | null
  })

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image (JPEG, PNG, WebP, or GIF)')
      return
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }
    
    setError(null)
    setFormData({ ...formData, image: file })
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setFormData({ ...formData, image: null })
    setPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!formData.image) {
      setError('Please select an image')
      return
    }
    if (!formData.name.trim()) {
      setError('Please enter a name')
      return
    }
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    
    setIsUploading(true)
    
    try {
      const token = await getAccessTokenSilently()
      
      // Step 1: Upload image to Cloudinary via backend
      const uploadFormData = new FormData()
      uploadFormData.append('file', formData.image)
      
      const uploadResponse = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      })
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || 'Failed to upload image')
      }
      
      const uploadResult = await uploadResponse.json()
      console.log('Upload successful:', uploadResult)
      
      // Step 2: Create the clothing item with the image URL
      const clothingResponse = await fetch('http://localhost:8000/api/clothes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          image_url: uploadResult.image_url,
          thumbnail_url: uploadResult.thumbnail_url
        })
      })
      
      if (!clothingResponse.ok) {
        throw new Error('Failed to save clothing item')
      }
      
      // Success! Navigate to wardrobe
      navigate('/wardrobe')
      
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsUploading(false)
    }
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
      handleFileSelect(e.dataTransfer.files[0])
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

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--error)]/10 border border-[var(--error)]/20 rounded-lg text-[var(--error)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload / Preview */}
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full max-h-80 object-contain rounded-2xl bg-[var(--bg-secondary)]"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-[var(--surface-card)] rounded-full shadow-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <X size={20} className="text-[var(--text-primary)]" />
            </button>
          </div>
        ) : (
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
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />
            <Upload className="mx-auto text-[var(--text-muted)] mb-4" size={48} />
            <p className="text-[var(--text-primary)] font-medium">
              Drop your image here
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-1">or click to browse</p>
            <p className="text-[var(--text-muted)] text-xs mt-2">JPEG, PNG, WebP, GIF • Max 10MB</p>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--surface-card)] text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            placeholder="e.g., Blue Oxford Shirt"
            disabled={isUploading}
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
                disabled={isUploading}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors border
                  ${formData.category === cat
                    ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]'
                    : 'bg-[var(--surface-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-wood)] hover:text-[var(--text-primary)]'}
                  disabled:opacity-50
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
          disabled={isUploading}
          className="w-full py-3 bg-[var(--brand-primary)] text-white font-semibold rounded-lg hover:bg-[var(--brand-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Uploading...
            </>
          ) : (
            'Add to Wardrobe'
          )}
        </button>
      </form>
    </div>
  )
}
