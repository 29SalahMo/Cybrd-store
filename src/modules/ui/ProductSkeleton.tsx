export default function ProductSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10">
      <div className="aspect-[4/5] bg-gradient-to-br from-black/40 to-ink/40 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-neon/20 rounded w-1/4 animate-pulse mt-2" />
      </div>
    </div>
  )
}

