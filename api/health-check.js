const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
}

export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).json({})
    return
  }

  if (req.method !== 'GET') {
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
    const healthStatus = {
      success: true,
      status: 'healthy',
      message: 'タコピーのサービスは正常に動作していますっピ！',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        vercelFunctions: 'ok',
        geminiAPI: process.env.GEMINI_API_KEY ? 'configured' : 'not-configured'
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }

    res.status(200).json(healthStatus)

  } catch (error) {
    console.error('Health check error:', error)

    res.status(500).json({
      success: false,
      status: 'unhealthy',
      message: 'サービスに問題が発生していますっピ',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}