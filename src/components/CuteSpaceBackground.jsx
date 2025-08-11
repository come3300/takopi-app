import { useEffect, useState, useCallback } from 'react'

const CuteSpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [animationTime, setAnimationTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationTime(prev => prev + 1)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Generate static cute stars
  const generateCuteStars = () => {
    const stars = []
    const positions = [
      // Small white circles
      { x: 15, y: 20, type: 'circle', size: 4 },
      { x: 85, y: 15, type: 'circle', size: 6 },
      { x: 45, y: 8, type: 'circle', size: 3 },
      { x: 75, y: 45, type: 'circle', size: 4 },
      { x: 25, y: 85, type: 'circle', size: 5 },
      { x: 90, y: 75, type: 'circle', size: 4 },
      { x: 5, y: 60, type: 'circle', size: 3 },
      { x: 65, y: 25, type: 'circle', size: 4 },
      
      // 4-pointed diamond stars
      { x: 35, y: 35, type: 'diamond', size: 8, color: '#4FD1C7' },
      { x: 70, y: 70, type: 'diamond', size: 12, color: '#FFFFFF' },
      { x: 15, y: 75, type: 'diamond', size: 6, color: '#FFE66D' },
      { x: 80, y: 30, type: 'diamond', size: 10, color: '#4FD1C7' },
      { x: 50, y: 60, type: 'diamond', size: 8, color: '#FFFFFF' },
      { x: 25, y: 40, type: 'diamond', size: 7, color: '#4FD1C7' },
    ]
    return positions
  }

  const cuteStars = generateCuteStars()

  // Floating planets with simple orbits
  const FloatingPlanet = ({ 
    className, 
    style, 
    children, 
    orbitRadius = 10, 
    orbitSpeed = 1,
    baseX,
    baseY 
  }) => {
    const orbitX = Math.cos(animationTime * orbitSpeed * 0.02) * orbitRadius
    const orbitY = Math.sin(animationTime * orbitSpeed * 0.02) * orbitRadius * 0.5
    const parallaxX = (mousePosition.x - 50) * 0.05
    const parallaxY = (mousePosition.y - 50) * 0.05

    return (
      <div
        className={`absolute rounded-full transition-transform duration-300 ${className}`}
        style={{
          ...style,
          left: `${baseX + orbitX}%`,
          top: `${baseY + orbitY}%`,
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      {/* Fixed background layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Cute gradient background matching reference */}
        <div 
          className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(75, 125, 200, 0.3) 0%, transparent 60%),
            linear-gradient(135deg, 
              #2B2D74 0%, 
              #3B4B8C 25%, 
              #4A5B9D 50%, 
              #2B2D74 75%, 
              #1E1F3F 100%
            )
          `
        }}
      />

      {/* Subtle twinkling overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(1px 1px at ${20 + Math.sin(animationTime * 0.02) * 5}px ${30 + Math.cos(animationTime * 0.025) * 8}px, #fff, transparent),
            radial-gradient(1px 1px at ${60 + Math.sin(animationTime * 0.018) * 7}px ${80 + Math.cos(animationTime * 0.022) * 6}px, #fff, transparent),
            radial-gradient(2px 2px at ${85 + Math.sin(animationTime * 0.015) * 4}px ${15 + Math.cos(animationTime * 0.028) * 5}px, #fff, transparent)
          `,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Cute static stars */}
      {cuteStars.map((star, index) => (
        <div key={index}>
          {star.type === 'circle' ? (
            <div
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: 0.6 + 0.4 * Math.sin(animationTime * 0.03 + index),
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)',
                transform: `scale(${0.8 + 0.2 * Math.sin(animationTime * 0.02 + index)})`
              }}
            />
          ) : (
            <div
              className="absolute"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: `rotate(${45 + animationTime * 0.5}deg) scale(${0.9 + 0.1 * Math.sin(animationTime * 0.025 + index)})`,
                opacity: 0.7 + 0.3 * Math.sin(animationTime * 0.02 + index * 0.5),
              }}
            >
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: `${star.size / 2}px solid transparent`,
                  borderRight: `${star.size / 2}px solid transparent`,
                  borderBottom: `${star.size}px solid ${star.color}`,
                  filter: `drop-shadow(0 0 4px ${star.color})`,
                  position: 'relative',
                }}
              />
              <div
                className="w-0 h-0 absolute"
                style={{
                  borderLeft: `${star.size / 2}px solid transparent`,
                  borderRight: `${star.size / 2}px solid transparent`,
                  borderTop: `${star.size}px solid ${star.color}`,
                  top: `-${star.size}px`,
                  left: `-${star.size / 2}px`,
                  filter: `drop-shadow(0 0 4px ${star.color})`,
                }}
              />
            </div>
          )}
        </div>
      ))}

      {/* Cute simplified planets based on reference image */}
      
      {/* Teal planet with purple ring */}
      <FloatingPlanet 
        className="w-32 h-32"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            #4FD1C7
          `,
          boxShadow: '0 0 30px rgba(79, 209, 199, 0.4)',
          position: 'relative',
        }}
        orbitRadius={15}
        orbitSpeed={0.8}
        baseX={8}
        baseY={18}
      >
        <div 
          className="absolute inset-0 rounded-full border-8 border-purple-400 opacity-70"
          style={{ transform: 'rotate(-15deg) scale(1.2)' }}
        />
      </FloatingPlanet>

      {/* Blue planet with yellow ring */}
      <FloatingPlanet 
        className="w-24 h-24"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            #6B8DD6
          `,
          boxShadow: '0 0 25px rgba(107, 141, 214, 0.4)',
        }}
        orbitRadius={12}
        orbitSpeed={1.2}
        baseX={35}
        baseY={50}
      >
        <div 
          className="absolute inset-0 rounded-full border-6 border-yellow-400 opacity-60"
          style={{ transform: 'rotate(25deg) scale(1.3)' }}
        />
      </FloatingPlanet>

      {/* Yellow/orange planet */}
      <FloatingPlanet 
        className="w-20 h-20"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5) 0%, transparent 40%),
            #FFE66D
          `,
          boxShadow: '0 0 20px rgba(255, 230, 109, 0.4)',
        }}
        orbitRadius={8}
        orbitSpeed={1.5}
        baseX={75}
        baseY={25}
      />

      {/* Another blue planet */}
      <FloatingPlanet 
        className="w-16 h-16"
        style={{
          background: `
            radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            #8B9BDB
          `,
          boxShadow: '0 0 18px rgba(139, 155, 219, 0.4)',
        }}
        orbitRadius={6}
        orbitSpeed={2}
        baseX={85}
        baseY={65}
      />

      {/* Small teal moon */}
      <FloatingPlanet 
        className="w-12 h-12"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.5) 0%, transparent 50%),
            #4FD1C7
          `,
          boxShadow: '0 0 15px rgba(79, 209, 199, 0.3)',
        }}
        orbitRadius={4}
        orbitSpeed={2.5}
        baseX={15}
        baseY={70}
      />

      {/* Saturn-like yellow planet */}
      <FloatingPlanet 
        className="w-28 h-28"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.4) 0%, transparent 40%),
            #FFE66D
          `,
          boxShadow: '0 0 25px rgba(255, 230, 109, 0.4)',
        }}
        orbitRadius={10}
        orbitSpeed={0.6}
        baseX={60}
        baseY={75}
      >
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50"
          style={{ transform: 'rotate(15deg) scale(1.4)' }}
        />
      </FloatingPlanet>

      {/* Cute shooting stars */}
      <div className="absolute inset-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute opacity-60"
            style={{
              top: `${10 + i * 25}%`,
              left: '-10px',
              animation: `shooting-star-cute 8s linear infinite`,
              animationDelay: `${i * 3}s`,
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white via-yellow-300 to-transparent w-12 h-px" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive floating code symbols */}
      {[
        { symbol: '</>', x: 25, y: 30, color: 'cyan', delay: 0 },
        { symbol: '{}', x: 70, y: 20, color: 'pink', delay: 1 },
        { symbol: '[]', x: 15, y: 70, color: 'yellow', delay: 2 },
        { symbol: '()', x: 80, y: 80, color: 'green', delay: 0.5 },
        { symbol: '=>', x: 50, y: 85, color: 'purple', delay: 1.5 },
        { symbol: '&&', x: 90, y: 45, color: 'blue', delay: 2.5 },
      ].map((item, index) => {
        const parallaxX = (mousePosition.x - 50) * 0.08 * (index % 2 ? 1 : -1)
        const parallaxY = (mousePosition.y - 50) * 0.08 * (index % 2 ? -1 : 1)
        const hoverScale = Math.sqrt(Math.pow(mousePosition.x - item.x, 2) + Math.pow(mousePosition.y - item.y, 2)) < 15 ? 1.3 : 1
        
        return (
          <div
            key={index}
            className="absolute font-mono font-bold text-xl opacity-40 select-none transition-all duration-300 hover:opacity-80"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              color: `var(--${item.color}-400)`,
              transform: `
                translate(${parallaxX}px, ${parallaxY}px) 
                scale(${hoverScale * (0.9 + 0.1 * Math.sin(animationTime * 0.02 + index))})
                rotate(${Math.sin(animationTime * 0.015 + index) * 10}deg)
              `,
              textShadow: `0 0 15px var(--${item.color}-400)`,
              animation: `cute-float ${3 + index * 0.5}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              cursor: 'pointer'
            }}
          >
            {item.symbol}
          </div>
        )
      })}

      {/* Floating Tacopii octopus */}
      <div 
        className="absolute text-3xl opacity-70 select-none transition-all duration-300 hover:scale-125 cursor-pointer"
        style={{ 
          top: `${40 + Math.sin(animationTime * 0.01) * 5}%`, 
          right: `${15 + Math.cos(animationTime * 0.012) * 3}%`,
          transform: `
            translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)
            rotate(${Math.sin(animationTime * 0.02) * 5}deg)
          `,
          filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.6))',
          animation: 'cute-float 4s ease-in-out infinite'
        }}
        onClick={() => {
          // Add a fun click effect
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(200)
          }
        }}
      >
        🐙✨
      </div>

      {/* Interactive particles that follow mouse */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const distance = 50 + Math.sin(animationTime * 0.02) * 20
        const x = mousePosition.x + Math.cos(angle + animationTime * 0.01) * distance * 0.1
        const y = mousePosition.y + Math.sin(angle + animationTime * 0.01) * distance * 0.1
        
        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30 pointer-events-none"
            style={{
              left: `${Math.max(0, Math.min(100, x))}%`,
              top: `${Math.max(0, Math.min(100, y))}%`,
              background: ['#4FD1C7', '#6B8DD6', '#FFE66D', '#FF69B4'][i % 4],
              boxShadow: `0 0 8px ${['#4FD1C7', '#6B8DD6', '#FFE66D', '#FF69B4'][i % 4]}`,
              animation: `twinkle ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        )
      })}

      </div>
      
      {/* Scrollable content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}

export default CuteSpaceBackground