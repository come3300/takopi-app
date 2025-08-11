import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes using dynamic imports (since our API files are CommonJS)
app.get('/api/health-check', async (req, res) => {
  const { default: healthCheck } = await import('./api/health-check.js')
  return healthCheck(req, res)
})

app.post('/api/consultation', async (req, res) => {
  const { default: consultation } = await import('./api/consultation.js')
  return consultation(req, res)
})

app.post('/api/generate-review', async (req, res) => {
  const { default: generateReview } = await import('./api/generate-review.js')
  return generateReview(req, res)
})

// Start server
app.listen(PORT, () => {
  console.log(`🐙 タコピーのAPIサーバーが起動しましたっピ！`)
  console.log(`🌟 ポート: ${PORT}`)
  console.log(`🔑 Gemini APIキー: ${process.env.GEMINI_API_KEY ? '設定済み✅' : '未設定❌'}`)
  console.log(`🚀 テスト: http://localhost:${PORT}/api/health-check`)
})