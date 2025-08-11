const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Import API handlers
const healthCheck = require('./api/health-check')
const consultation = require('./api/consultation')
const generateReview = require('./api/generate-review')

// API Routes
app.get('/api/health-check', healthCheck)
app.post('/api/consultation', consultation)
app.post('/api/generate-review', generateReview)

// Start server
app.listen(PORT, () => {
  console.log(`🐙 タコピーのAPIサーバーが起動しましたっピ！`)
  console.log(`🌟 ポート: ${PORT}`)
  console.log(`🔑 Gemini APIキー: ${process.env.GEMINI_API_KEY ? '設定済み✅' : '未設定❌'}`)
  console.log(`🚀 テスト: http://localhost:${PORT}/api/health-check`)
})