import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuideModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl">Size Guide</h2>
                <button
                  onClick={onClose}
                  aria-label="Close size guide"
                  className="p-2 hover:bg-white/10 rounded-md transition"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-bone/70 mb-4">
                    Our hoodies are designed for a relaxed fit. If you prefer a tighter fit, consider sizing down.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 font-semibold">Size</th>
                          <th className="text-left p-3 font-semibold">Chest (inches)</th>
                          <th className="text-left p-3 font-semibold">Length (inches)</th>
                          <th className="text-left p-3 font-semibold">Sleeve (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-medium">M</td>
                          <td className="p-3 text-bone/70">40-42</td>
                          <td className="p-3 text-bone/70">28</td>
                          <td className="p-3 text-bone/70">26</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-medium">L</td>
                          <td className="p-3 text-bone/70">44-46</td>
                          <td className="p-3 text-bone/70">29</td>
                          <td className="p-3 text-bone/70">27</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="p-3 font-medium">XL</td>
                          <td className="p-3 text-bone/70">48-50</td>
                          <td className="p-3 text-bone/70">30</td>
                          <td className="p-3 text-bone/70">28</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">2XL</td>
                          <td className="p-3 text-bone/70">52-54</td>
                          <td className="p-3 text-bone/70">31</td>
                          <td className="p-3 text-bone/70">29</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 text-xs text-bone/60">
                  <p>Measurements are approximate and may vary slightly. For the best fit, measure your favorite hoodie.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


