import { useEffect, useState } from 'react'

const SpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState([])

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const starArray = []
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleDelay: Math.random() * 5
        })
      }
      setStars(starArray)
    }

    generateStars()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const Planet = ({ className, style, children }) => (
    <div 
      className={`absolute rounded-full ${className}`}
      style={{
        ...style,
        transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px) ${style?.transform || ''}`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  )

  const FloatingPlanet = ({ className, style, delay = 0 }) => (
    <div 
      className={`absolute rounded-full ${className}`}
      style={{
        ...style,
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`
      }}
    />
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />

      {/* Animated stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.twinkleDelay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`
          }}
        />
      ))}

      {/* Shooting stars */}
      <div className="shooting-star" style={{ animationDelay: '2s' }} />
      <div className="shooting-star" style={{ animationDelay: '6s' }} />
      <div className="shooting-star" style={{ animationDelay: '10s' }} />

      {/* Large planets */}
      <Planet 
        className="w-32 h-32 opacity-90"
        style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          top: '10%',
          left: '15%',
          boxShadow: '0 0 50px rgba(79, 172, 254, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)'
        }}
      >
        <div 
          className="absolute inset-0 rounded-full border-4 border-purple-300 opacity-50"
          style={{ transform: 'rotate(-15deg) scale(1.2)' }}
        />
      </Planet>

      <Planet 
        className="w-24 h-24 opacity-80"
        style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          top: '60%',
          right: '10%',
          boxShadow: '0 0 40px rgba(250, 112, 154, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.3)'
        }}
      >
        <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full opacity-60" />
        <div className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full opacity-40" />
      </Planet>

      {/* Floating small planets */}
      <FloatingPlanet 
        className="w-16 h-16 opacity-70"
        style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          top: '30%',
          right: '25%',
          boxShadow: '0 0 25px rgba(168, 237, 234, 0.3)'
        }}
        delay={1}
      />

      <FloatingPlanet 
        className="w-12 h-12 opacity-60"
        style={{
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          top: '75%',
          left: '25%',
          boxShadow: '0 0 20px rgba(255, 236, 210, 0.3)'
        }}
        delay={2.5}
      />

      <FloatingPlanet 
        className="w-20 h-20 opacity-75"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          top: '20%',
          right: '45%',
          boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)'
        }}
        delay={1.8}
      >
        <div 
          className="absolute inset-0 rounded-full border-2 border-yellow-300 opacity-40"
          style={{ transform: 'rotate(25deg) scale(1.3)' }}
        />
      </FloatingPlanet>

      {/* Tacopii's Happy Star - special planet */}
      <Planet 
        className="w-20 h-20 opacity-90"
        style={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          top: '45%',
          left: '5%',
          boxShadow: '0 0 40px rgba(255, 154, 158, 0.6), 0 0 80px rgba(254, 207, 239, 0.3)',
          animation: 'pulse 3s ease-in-out infinite'
        }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
          ✨
        </div>
      </Planet>

      {/* Floating code symbols */}
      <div className="absolute top-1/4 left-1/3 opacity-20 text-cyan-300 text-lg animate-bounce" style={{ animationDelay: '1s' }}>
        {'</>'}
      </div>
      <div className="absolute top-3/4 right-1/4 opacity-20 text-purple-300 text-xl animate-bounce" style={{ animationDelay: '2s' }}>
        {'{}'}
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-20 text-pink-300 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
        {'()'}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>
    </div>
  )
}

export default SpaceBackground