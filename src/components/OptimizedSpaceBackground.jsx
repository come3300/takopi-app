import { useEffect, useState, useCallback, useRef, useMemo } from 'react'

const OptimizedSpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [time, setTime] = useState(0)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const ctxRef = useRef(null)

  // メモ化された固定データ
  const starsData = useMemo(() => {
    const stars = []
    for (let i = 0; i < 80; i++) { // さらに削減
      stars.push({
        x: Math.random() * window.innerWidth || 800,
        y: Math.random() * window.innerHeight || 600,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: 0.5 + Math.random() * 1,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? `hsl(${Math.random() * 60 + 200}, 70%, 70%)` : '#ffffff'
      })
    }
    return stars
  }, [])

  const nebulaeData = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * 120 - 10,
      y: Math.random() * 120 - 10,
      size: 40 + Math.random() * 40,
      opacity: 0.1 + Math.random() * 0.15,
      color: ['#4A90E2', '#7B68EE', '#FF6B9D'][i],
      rotationSpeed: 0.05 + Math.random() * 0.1
    }))
  }, [])

  // Canvas レンダリングで星を描画（高速化）
  const drawStars = useCallback((ctx, canvas) => {
    if (!ctx || !canvas) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    starsData.forEach(star => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase)
      const parallaxX = (mousePosition.x - 50) * 0.02
      const parallaxY = (mousePosition.y - 50) * 0.02
      
      ctx.beginPath()
      ctx.arc(
        star.x + parallaxX, 
        star.y + parallaxY, 
        star.size * (0.5 + twinkle * 0.5), 
        0, 
        Math.PI * 2
      )
      
      ctx.fillStyle = star.color
      ctx.globalAlpha = star.opacity * twinkle
      ctx.fill()
      
      // 簡単なグロー効果
      if (star.size > 1.5) {
        ctx.beginPath()
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = (star.opacity * twinkle) * 0.1
        ctx.fill()
      }
    })
    
    ctx.globalAlpha = 1
  }, [time, mousePosition.x, mousePosition.y, starsData])

  // Canvas初期化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx
    
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      ctx.scale(dpr, dpr)
    }
    
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // 最適化されたアニメーションループ（60fps→24fps）
  useEffect(() => {
    let startTime = Date.now()
    let lastTime = 0
    
    const animate = (currentTime) => {
      // 24fpsに制限してパフォーマンス向上
      if (currentTime - lastTime > 42) {
        setTime((currentTime - startTime) * 0.001)
        lastTime = currentTime
        
        if (ctxRef.current && canvasRef.current) {
          drawStars(ctxRef.current, canvasRef.current)
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [drawStars])

  // スロットルされたマウス移動
  const handleMouseMove = useCallback((e) => {
    if (typeof window === 'undefined') return
    
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [])

  // マウスイベントをスロットル
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let timeoutId = null
    const throttledMouseMove = (e) => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleMouseMove(e)
        timeoutId = null
      }, 16) // 60fpsに制限
    }
    
    window.addEventListener('mousemove', throttledMouseMove)
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [handleMouseMove])

  // 軽量化された惑星コンポーネント
  const OptimizedPlanet = ({ 
    className, 
    style, 
    baseX, 
    baseY,
    children
  }) => {
    const translateX = (mousePosition.x - 50) * 0.01
    const translateY = (mousePosition.y - 50) * 0.01
    const scale = 1 + Math.sin(time * 0.3) * 0.02 // 軽微な呼吸効果のみ

    return (
      <div
        className={`absolute rounded-full ${className}`}
        style={{
          ...style,
          left: `${baseX}%`,
          top: `${baseY}%`,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
          willChange: 'transform' // GPU加速
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      {/* 固定背景レイヤー */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 軽量グラデーション背景 */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                #0a0a1a 0%, 
                #1a0a2e 25%,
                #2d1b3d 50%,
                #1e1a2e 75%,
                #000 100%
              )
            `
          }}
        />

        {/* Canvas星フィールド */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* 軽量化されたネビュラ */}
        {nebulaeData.map((nebula, index) => (
          <div
            key={index}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}vw`,
              height: `${nebula.size * 0.7}vh`,
              background: `radial-gradient(ellipse closest-side, ${nebula.color}40 0%, transparent 70%)`,
              transform: `rotate(${time * nebula.rotationSpeed * 5}deg)`,
              filter: 'blur(2px)',
              willChange: 'transform'
            }}
          />
        ))}

        {/* 最適化された惑星 */}
        <OptimizedPlanet
          className="w-32 h-32"
          baseX={12}
          baseY={20}
          style={{
            background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
            boxShadow: '0 0 30px rgba(79, 172, 254, 0.3)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        </OptimizedPlanet>

        <OptimizedPlanet
          className="w-24 h-24"
          baseX={75}
          baseY={15}
          style={{
            background: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
            boxShadow: '0 0 25px rgba(250, 112, 154, 0.3)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        </OptimizedPlanet>

        <OptimizedPlanet
          className="w-20 h-20"
          baseX={85}
          baseY={70}
          style={{
            background: 'linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%)',
            boxShadow: '0 0 20px rgba(168, 237, 234, 0.3)'
          }}
        />

        {/* 軽量化されたインタラクティブ要素 */}
        {[
          { symbol: '</>', x: 25, y: 25, color: '#64B5F6' },
          { symbol: '{}', x: 70, y: 15, color: '#81C784' },
          { symbol: '=>', x: 80, y: 80, color: '#F48FB1' }
        ].map((item, index) => (
          <div
            key={index}
            className="absolute font-mono font-bold text-xl select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              color: item.color,
              transform: `translate(-50%, -50%) scale(${1 + Math.sin(time + index) * 0.05})`,
              textShadow: `0 0 10px ${item.color}`,
              opacity: 0.6,
              willChange: 'transform'
            }}
          >
            {item.symbol}
          </div>
        ))}

        {/* 最適化されたタコピー */}
        <div
          className="absolute text-3xl select-none"
          style={{
            top: '45%',
            right: '10%',
            transform: `translate3d(0, ${Math.sin(time * 0.5) * 5}px, 0)`,
            filter: 'drop-shadow(0 0 15px #FF69B4)',
            willChange: 'transform'
          }}
        >
          🐙✨
        </div>
      </div>
      
      {/* スクロール可能コンテンツ */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}

export default OptimizedSpaceBackground