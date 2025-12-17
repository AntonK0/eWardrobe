interface ClothingCardProps {
  item: {
    id: number
    name: string
    category: string
    image: string
  }
}

export default function ClothingCard({ item }: ClothingCardProps) {
  return (
    <div className="bg-[var(--surface-card)] rounded-xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:shadow-lg transition-all cursor-pointer">
      <img
        src={item.image}
        alt={item.name}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3">
        <h3 className="text-[var(--text-primary)] font-medium truncate">{item.name}</h3>
        <p className="text-[var(--text-muted)] text-sm">{item.category}</p>
      </div>
    </div>
  )
}
