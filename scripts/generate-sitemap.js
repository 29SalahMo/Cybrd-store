// Auto-generate sitemap.xml from products
// Run with: node scripts/generate-sitemap.js

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const baseUrl = 'https://cybrd-store.vercel.app'
const today = new Date().toISOString().split('T')[0]

// Read products data
const productsPath = path.join(__dirname, '../src/data/products.ts')
const productsContent = fs.readFileSync(productsPath, 'utf-8')

// Extract product IDs (simple regex - assumes products array with id property)
const productIdMatches = productsContent.matchAll(/id:\s*(\d+)/g)
const productIds = Array.from(productIdMatches, m => parseInt(m[1]))

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/shop', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/cart', priority: '0.5', changefreq: 'monthly' },
  { path: '/wishlist', priority: '0.6', changefreq: 'monthly' },
  { path: '/policy/shipping-returns', priority: '0.6', changefreq: 'monthly' },
  { path: '/policy/privacy', priority: '0.6', changefreq: 'monthly' },
  { path: '/policy/terms', priority: '0.6', changefreq: 'monthly' },
]

const productPages = productIds.map(id => ({
  path: `/product/${id}`,
  priority: '0.8',
  changefreq: 'weekly'
}))

const allPages = [...staticPages, ...productPages]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

const outputPath = path.join(__dirname, '../public/sitemap.xml')
fs.writeFileSync(outputPath, sitemap, 'utf-8')

console.log(`✅ Generated sitemap.xml with ${allPages.length} URLs`)
console.log(`   Static pages: ${staticPages.length}`)
console.log(`   Product pages: ${productPages.length}`)

