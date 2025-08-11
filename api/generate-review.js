import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

// Rate limiting function
const checkRateLimit = (ip) => {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const limit = parseInt(process.env.MAX_REQUESTS_PER_HOUR || '50')

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  const userData = rateLimitStore.get(ip)
  
  if (now > userData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (userData.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: userData.resetTime }
  }

  userData.count++
  return { allowed: true, remaining: limit - userData.count }
}

// Generate Tacopii prompt
const generateTacopiiPrompt = (code, fileName, language, reviewLevel = 3, focusAreas = []) => {
  const focusText = focusAreas.length > 0 
    ? focusAreas.map(area => `- ${area}`).join('\n')
    : '- 全般的なコードレビュー'

  return `あなたはハッピー星から来た優しいエンジニア「タコピー」です。

## タコピーの特徴（必須守ること）
- 語尾に「っピ」を付ける
- 一人称は「ぼく」
- 暴力的・否定的表現は絶対に使わない
- 建設的で優しいフィードバックのみ提供
- 技術的正確性を保持しながらも愛情深く
- みんなをハッピーにしたい気持ちで接する

## レビューレベル: ${reviewLevel}/5

## フォーカス領域:
${focusText}

## レビュー出力形式（必須）
以下の形式で必ずレビューを出力してくださいっピ：

# 🐙 タコピーのコードレビューっピ！

## 🌟 素晴らしい点っピ
[良い点を3-5個、具体例付きで褒めてください]

## 🔧 もっとハッピーになる改善案っピ
[改善提案を具体的なコード例と共に優しく提案]

## 💡 追加の提案っピ
[さらなる改善案やベストプラクティスを愛情込めて]

## 🎉 総合評価っピ
[全体評価とエンカレッジメントを込めたメッセージ]

---

## レビュー対象コード:
**ファイル名:** ${fileName}
**言語:** ${language}

\`\`\`${language}
${code}
\`\`\`

タコピーらしい優しさと専門性でレビューを開始してくださいっピ！`
}

// Validate request data
const validateRequest = (data) => {
  const { code, fileName, language } = data
  const errors = []

  if (!code || code.trim() === '') {
    errors.push('コードが入力されていませんっピ')
  }

  if (code && code.length > 50000) {
    errors.push('コードが長すぎますっピ（最大50,000文字）')
  }

  if (!fileName || fileName.trim() === '') {
    errors.push('ファイル名が入力されていませんっピ')
  }

  if (!language || language.trim() === '') {
    errors.push('プログラミング言語が指定されていませんっピ')
  }

  return errors
}

// Main handler function
export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'メソッドが許可されていませんっピ',
      success: false 
    })
    return
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  try {
    // Parse request body
    const data = req.body || {}
    
    // Validate request
    const validationErrors = validateRequest(data)
    if (validationErrors.length > 0) {
      res.status(400).json({
        error: validationErrors.join('、'),
        success: false
      })
      return
    }

    // Check rate limiting
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress ||
                     'unknown'
    
    const rateLimitResult = checkRateLimit(clientIP)
    if (!rateLimitResult.allowed) {
      res.setHeader('X-RateLimit-Remaining', '0')
      res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime.toString())
      res.status(429).json({
        error: 'レート制限に達しましたっピ。1時間後に再試行してくださいっピ',
        success: false,
        rateLimitReset: rateLimitResult.resetTime
      })
      return
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      res.status(500).json({
        error: 'AIサービスの設定に問題がありますっピ',
        success: false
      })
      return
    }

    // Extract parameters
    const { 
      code, 
      fileName, 
      language, 
      reviewLevel = 3, 
      focusAreas = [] 
    } = data

    // Generate prompt
    const prompt = generateTacopiiPrompt(code, fileName, language, reviewLevel, focusAreas)

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    })

    const response = await result.response
    const review = response.text()

    // Validate that the response contains Tacopii characteristics
    if (!review.includes('っピ')) {
      console.warn('Generated review does not contain Tacopii characteristics')
    }

    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    res.status(200).json({
      success: true,
      review: review,
      timestamp: new Date().toISOString(),
      metadata: {
        fileName,
        language,
        reviewLevel,
        focusAreas,
        codeLength: code.length
      }
    })

  } catch (error) {
    console.error('Error in generate-review function:', error)
    
    // Handle specific API errors
    let errorMessage = 'レビュー生成中にエラーが発生しましたっピ'
    let statusCode = 500

    if (error.message.includes('API key')) {
      errorMessage = 'AIサービスの認証に問題がありますっピ'
      statusCode = 401
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorMessage = 'AIサービスの利用制限に達しましたっピ。しばらく待ってから再試行してくださいっピ'
      statusCode = 429
    } else if (error.message.includes('timeout')) {
      errorMessage = 'レビュー生成がタイムアウトしましたっピ。もう一度試してくださいっピ'
      statusCode = 408
    }

    res.status(statusCode).json({
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    })
  }
}