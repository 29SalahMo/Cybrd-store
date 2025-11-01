// Bundle size analysis script
// Run with: npm run build && node scripts/bundle-analyze.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { gzipSync } from 'zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, '../dist')

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function analyzeDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      results.push(...analyzeDirectory(fullPath))
    } else if (file.name.endsWith('.js') || file.name.endsWith('.css')) {
      const stats = fs.statSync(fullPath)
      const content = fs.readFileSync(fullPath)
      const gzipped = gzipSync(content)
      
      results.push({
        name: path.relative(distPath, fullPath),
        size: stats.size,
        gzipped: gzipped.length,
        type: file.name.endsWith('.js') ? 'JS' : 'CSS'
      })
    }
  }
  
  return results
}

console.log('📦 Bundle Analysis\n')
console.log('Analyzing build output...\n')

if (!fs.existsSync(distPath)) {
  console.error('❌ dist/ directory not found. Run npm run build first.')
  process.exit(1)
}

const files = analyzeDirectory(distPath)
files.sort((a, b) => b.size - a.size)

let totalSize = 0
let totalGzipped = 0

console.log('File Size Analysis:')
console.log('─'.repeat(80))
console.log(`${'File'.padEnd(40)} ${'Original'.padEnd(12)} ${'Gzipped'.padEnd(12)} Type`)
console.log('─'.repeat(80))

for (const file of files) {
  totalSize += file.size
  totalGzipped += file.gzipped
  const displayName = file.name.length > 38 ? '...' + file.name.slice(-35) : file.name
  console.log(
    `${displayName.padEnd(40)} ${formatBytes(file.size).padEnd(12)} ${formatBytes(file.gzipped).padEnd(12)} ${file.type}`
  )
}

console.log('─'.repeat(80))
console.log(`${'TOTAL'.padEnd(40)} ${formatBytes(totalSize).padEnd(12)} ${formatBytes(totalGzipped).padEnd(12)}`)
console.log('─'.repeat(80))

// Recommendations
console.log('\n💡 Recommendations:')
if (totalGzipped > 500 * 1024) {
  console.log('⚠️  Bundle size exceeds 500KB. Consider code splitting.')
}
if (files.filter(f => f.size > 200 * 1024).length > 0) {
  console.log('⚠️  Large files detected. Consider lazy loading or splitting.')
}
console.log('✅ Use lazy loading for routes (already implemented)')
console.log('✅ Use code splitting for large dependencies')
console.log('✅ Consider tree-shaking unused code')

