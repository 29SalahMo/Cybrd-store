import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '../../data/products'

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (productId: number) => void
  placeholder?: string
  className?: string
}

export function SearchAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  placeholder = "Search products...",
  className = ""
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 2) return []
    const query = value.toLowerCase()
    return products
      .filter(p => p.name.toLowerCase().includes(query))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        matchIndex: p.name.toLowerCase().indexOf(query)
      }))
  }, [value])

  useEffect(() => {
    setIsOpen(suggestions.length > 0 && value.trim().length >= 2)
    setHighlightedIndex(0)
  }, [suggestions.length, value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex(prev => (prev + 1) % suggestions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
      } else if (e.key === 'Enter' && suggestions[highlightedIndex]) {
        e.preventDefault()
        handleSelect(suggestions[highlightedIndex].id)
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, suggestions, highlightedIndex])

  const handleSelect = (productId: number) => {
    onChange('')
    setIsOpen(false)
    if (onSelect) {
      onSelect(productId)
    } else {
      navigate(`/product/${productId}`)
    }
    inputRef.current?.blur()
  }

  const highlightText = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-neon/30 text-neon">{text.slice(index, index + query.length)}</mark>
        {text.slice(index + query.length)}
      </>
    )
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 rounded-md bg-black/40 border border-white/15 text-bone focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {value && (
          <button
            onClick={() => {
              onChange('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-black border border-white/20 rounded-lg shadow-xl overflow-hidden"
            role="listbox"
          >
            {suggestions.map((suggestion, idx) => (
              <motion.button
                key={suggestion.id}
                onClick={() => handleSelect(suggestion.id)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${
                  idx === highlightedIndex ? 'bg-neon/10' : ''
                }`}
                role="option"
                aria-selected={idx === highlightedIndex}
              >
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-12 h-16 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-bone truncate">
                    {highlightText(suggestion.name, value)}
                  </div>
                  <div className="text-sm text-neon mt-0.5">{suggestion.price}</div>
                </div>
                <svg
                  className="w-4 h-4 text-bone/40 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

