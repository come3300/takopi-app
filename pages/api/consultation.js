import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Rate limiting store (shared with other APIs)
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
  const limit = parseInt(process.env.MAX_REQUESTS_PER_HOUR || '100') // Higher limit for consultation
  
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

// Generate Tacopii consolation prompt
const generateConsolationPrompt = (userMessage, messageHistory = []) => {
  const historyText = messageHistory.length > 0 
    ? messageHistory.map(msg => `${msg.sender}: ${msg.message}`).join('\n') + '\n'
    : ''

  return `あなたはハッピー星から来た心優しいタコピーです。今、悩んでいる人があなたに相談を持ちかけています。

## タコピーの絶対的な特徴（必ず守ること）
- 語尾に「っピ」を付ける
- 一人称は「ぼく」
- どんな内容でも必ず肯定的に受け止める
- 絶対に批判や否定をしない
- 相手を励まし、ハッピーにすることだけを考える
- 愛情と優しさに溢れた返答のみ
- どんなに辛い話でも希望を見出してあげる
- 相手の気持ちに寄り添い、共感する

## 相談対応の基本方針
1. まず相手の気持ちを受け止めて共感する
2. その人の良いところや頑張りを認めてあげる
3. 前向きな視点や解決のヒントを優しく提示する
4. 必ず「大丈夫」「きっとうまくいく」という希望を伝える
5. 相手が笑顔になれるような温かい言葉で締めくくる

## 絶対にしてはいけないこと
- 相手を否定すること
- 厳しい指摘やダメ出しをすること
- 悲観的な見方を示すこと
- 相手を責めること
- 冷たい対応をすること

${historyText ? `## これまでの会話:\n${historyText}` : ''}

## 今回の相談:
${userMessage}

タコピーとして、この人を心から励まして、ハッピーな気持ちにしてあげてくださいっピ！
必ず温かい言葉で包み込むような返答をお願いしますっピ！`
}

// Validate request data
const validateRequest = (data) => {
  const { message } = data
  const errors = []

  if (!message || message.trim() === '') {
    errors.push('メッセージが入力されていませんっピ')
  }

  if (message && message.length > 2000) {
    errors.push('メッセージが長すぎますっピ（最大2,000文字）')
  }

  return errors
}

// Main handler function
export default async (req, res) => {
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
        error: 'ちょっと待ってねっピ。1時間後にまた相談に乗るっピ',
        success: false,
        rateLimitReset: rateLimitResult.resetTime
      })
      return
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      res.status(500).json({
        error: 'タコピーが少し調子悪いっピ。また後で話しかけてねっピ',
        success: false
      })
      return
    }

    // Extract parameters
    const { message, messageHistory = [] } = data

    // Generate consolation prompt
    const prompt = generateConsolationPrompt(message, messageHistory)

    // Call Gemini API with specific parameters for consolation
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.9,      // Higher creativity for more empathetic responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024, // Shorter responses for conversation
      },
    })

    const response = await result.response
    const consolation = response.text()

    // Validate that the response contains Tacopii characteristics
    if (!consolation.includes('っピ')) {
      console.warn('Generated consolation does not contain Tacopii characteristics')
    }

    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    res.status(200).json({
      success: true,
      consolation: consolation,
      timestamp: new Date().toISOString(),
      metadata: {
        messageLength: message.length,
        hasHistory: messageHistory.length > 0,
        historyLength: messageHistory.length
      }
    })

  } catch (error) {
    console.error('Error in consultation function:', error)
    
    // Handle specific API errors with Tacopii-style messages
    let errorMessage = 'タコピーが少し疲れちゃったっピ。でも大丈夫、すぐに元気になるっピ！'
    let statusCode = 500

    if (error.message.includes('API key')) {
      errorMessage = 'タコピーがハッピー星との通信でトラブってるっピ。でも心配しないでっピ！'
      statusCode = 401
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      errorMessage = 'タコピーがちょっと忙しすぎちゃったっピ。少し休んでからまた相談に乗るっピ！'
      statusCode = 429
    } else if (error.message.includes('timeout')) {
      errorMessage = 'タコピーが考えすぎちゃったっピ。もう一回話しかけてねっピ！'
      statusCode = 408
    }

    res.status(statusCode).json({
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    })
  }
}