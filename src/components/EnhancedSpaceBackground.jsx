import { useEffect, useState, useCallback } from 'react'

const EnhancedSpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [stars, setStars] = useState([])
  const [particles, setParticles] = useState([])
  const [time, setTime] = useState(0)

  useEffect(() => {
    // Generate enhanced stars with different types
    const generateStars = () => {
      const starArray = []
      for (let i = 0; i < 200; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          opacity: Math.random() * 0.9 + 0.1,
          twinkleSpeed: Math.random() * 3 + 1,
          type: Math.random() > 0.8 ? 'colorful' : 'normal',
          color: ['#ffffff', '#ffb3d9', '#b3d9ff', '#d9ffb3', '#ffccb3'][Math.floor(Math.random() * 5)]
        })
      }
      setStars(starArray)
    }

    // Generate floating particles
    const generateParticles = () => {
      const particleArray = []
      for (let i = 0; i < 30; i++) {
        particleArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          speed: Math.random() * 0.5 + 0.1,
          direction: Math.random() * 360,
          opacity: Math.random() * 0.6 + 0.2,
          color: ['#4facfe', '#00f2fe', '#fa709a', '#fee140', '#a8edea', '#fed6e3'][Math.floor(Math.random() * 6)]
        })
      }
      setParticles(particleArray)
    }

    generateStars()
    generateParticles()

    // Animation timer
    const timer = setInterval(() => {
      setTime(prev => prev + 1)
    }, 50)

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

  // Animated 3D Planet Component
  const AnimatedPlanet = ({ className, style, children, rotationSpeed = 1, floatIntensity = 1 }) => {
    const rotation = (time * rotationSpeed) % 360
    const floatY = Math.sin(time * 0.02) * floatIntensity * 5
    const parallaxX = (mousePosition.x - 50) * 0.1
    const parallaxY = (mousePosition.y - 50) * 0.1

    return (
      <div 
        className={`absolute rounded-full ${className}`}
        style={{
          ...style,
          transform: `
            translateX(${parallaxX}px) 
            translateY(${parallaxY + floatY}px) 
            rotate(${rotation}deg)
            ${style?.transform || ''}
          `,
          transition: 'transform 0.1s ease-out',
          filter: `blur(${Math.abs(parallaxX + parallaxY) * 0.01}px)`
        }}
      >
        {children}
        {/* Planet glow effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)`,
            transform: 'scale(0.8)'
          }}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced gradient background with nebula effects */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 60% 40%, rgba(198, 255, 119, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)
          `
        }}
      />

      {/* Animated cosmic dust */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(2px 2px at ${20 + Math.sin(time * 0.01) * 10}px ${20 + Math.cos(time * 0.02) * 10}px, #fff, transparent),
          radial-gradient(2px 2px at ${40 + Math.sin(time * 0.015) * 15}px ${90 + Math.cos(time * 0.025) * 15}px, #fff, transparent),
          radial-gradient(1px 1px at ${90 + Math.sin(time * 0.012) * 20}px ${50 + Math.cos(time * 0.018) * 20}px, #fff, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px, 120px 120px, 80px 80px',
        opacity: 0.3
      }} />

      {/* Enhanced stars with twinkling */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.type === 'colorful' ? star.color : '#ffffff',
            opacity: star.opacity * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed * 0.05)),
            boxShadow: `
              0 0 ${star.size * 2}px ${star.type === 'colorful' ? star.color : '#ffffff'},
              0 0 ${star.size * 4}px ${star.type === 'colorful' ? star.color + '80' : 'rgba(255, 255, 255, 0.5)'}
            `,
            transform: `scale(${0.8 + 0.2 * Math.sin(time * star.twinkleSpeed * 0.05)})`
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map(particle => {
        const particleX = particle.x + Math.sin(time * particle.speed * 0.02) * 5
        const particleY = particle.y + Math.cos(time * particle.speed * 0.015) * 3
        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particleX}%`,
              top: `${particleY}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}80 70%, transparent 100%)`,
              opacity: particle.opacity,
              transform: `rotate(${time * particle.speed}deg)`,
              filter: 'blur(0.5px)'
            }}
          />
        )
      })}

      {/* Multiple shooting stars */}
      {[0, 1, 2, 3].map(i => (
        <div 
          key={i}
          className="shooting-star-enhanced" 
          style={{ 
            animationDelay: `${i * 4}s`,
            top: `${20 + i * 20}%`
          }} 
        />
      ))}

      {/* Enhanced 3D Planets */}
      <AnimatedPlanet 
        className="w-40 h-40 opacity-90"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, #ffffff40 0%, transparent 50%),
            linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
          `,
          top: '8%',
          left: '12%',
          boxShadow: `
            0 0 60px rgba(79, 172, 254, 0.6),
            inset 0 0 30px rgba(255, 255, 255, 0.2)
          `
        }}
        rotationSpeed={0.3}
        floatIntensity={2}
      >
        <div 
          className="absolute inset-4 rounded-full border-2 border-purple-300 opacity-30"
          style={{ transform: 'rotate(-15deg) scale(1.4)' }}
        />
        <div className="absolute top-6 left-8 w-3 h-3 bg-white rounded-full opacity-70" />
        <div className="absolute bottom-8 right-6 w-2 h-2 bg-cyan-200 rounded-full opacity-50" />
      </AnimatedPlanet>

      <AnimatedPlanet 
        className="w-32 h-32 opacity-85"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, #ffffff50 0%, transparent 40%),
            linear-gradient(135deg, #fa709a 0%, #fee140 100%)
          `,
          top: '55%',
          right: '8%',
          boxShadow: `
            0 0 50px rgba(250, 112, 154, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.3)
          `
        }}
        rotationSpeed={0.5}
        floatIntensity={1.5}
      >
        <div className="absolute inset-0 rounded-full">
          <div className="absolute top-3 left-4 w-3 h-3 bg-white rounded-full opacity-60" />
          <div className="absolute bottom-4 right-3 w-2 h-2 bg-yellow-200 rounded-full opacity-40" />
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full opacity-80" />
        </div>
      </AnimatedPlanet>

      <AnimatedPlanet 
        className="w-24 h-24 opacity-75"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, #ffffff30 0%, transparent 50%),
            linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)
          `,
          top: '25%',
          right: '28%',
          boxShadow: '0 0 40px rgba(168, 237, 234, 0.4)'
        }}
        rotationSpeed={0.8}
        floatIntensity={1}
      />

      {/* Saturn-like planet with rings */}
      <AnimatedPlanet 
        className="w-28 h-28 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, #ffffff40 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `,
          top: '18%',
          right: '42%',
          boxShadow: '0 0 45px rgba(102, 126, 234, 0.4)'
        }}
        rotationSpeed={0.4}
        floatIntensity={1.8}
      >
        <div 
          className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-40"
          style={{ transform: 'rotate(25deg) scale(1.6)' }}
        />
        <div 
          className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-20"
          style={{ transform: 'rotate(25deg) scale(1.8)' }}
        />
      </AnimatedPlanet>

      {/* Tacopii's Happy Star with enhanced effects */}
      <AnimatedPlanet 
        className="w-24 h-24 opacity-95"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, #ffffff60 0%, transparent 40%),
            linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fad0c4 100%)
          `,
          top: '42%',
          left: '3%',
          boxShadow: `
            0 0 50px rgba(255, 154, 158, 0.8),
            0 0 100px rgba(254, 207, 239, 0.4),
            inset 0 0 15px rgba(255, 255, 255, 0.5)
          `
        }}
        rotationSpeed={0.6}
        floatIntensity={2.5}
      >
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg animate-pulse">
          ✨
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-80 animate-ping" />
      </AnimatedPlanet>

      {/* Floating code symbols with 3D effect */}
      <div 
        className="absolute opacity-30 text-cyan-300 text-xl font-mono animate-bounce select-none"
        style={{ 
          top: '20%', 
          left: '35%',
          animationDelay: '1s',
          textShadow: '0 0 20px currentColor, 0 4px 8px rgba(0,0,0,0.3)',
          transform: `perspective(100px) rotateX(${Math.sin(time * 0.02) * 10}deg) rotateY(${Math.cos(time * 0.015) * 15}deg)`
        }}
      >
        {'</>'}
      </div>
      
      <div 
        className="absolute opacity-30 text-purple-300 text-2xl font-mono animate-bounce select-none"
        style={{ 
          top: '70%', 
          right: '20%',
          animationDelay: '2.5s',
          textShadow: '0 0 20px currentColor, 0 4px 8px rgba(0,0,0,0.3)',
          transform: `perspective(100px) rotateX(${Math.sin(time * 0.025) * 10}deg) rotateY(${Math.cos(time * 0.018) * 15}deg)`
        }}
      >
        {'{}'}
      </div>
      
      <div 
        className="absolute opacity-30 text-pink-300 text-lg font-mono animate-bounce select-none"
        style={{ 
          top: '45%', 
          left: '25%',
          animationDelay: '0.8s',
          textShadow: '0 0 20px currentColor, 0 4px 8px rgba(0,0,0,0.3)',
          transform: `perspective(100px) rotateX(${Math.sin(time * 0.022) * 10}deg) rotateY(${Math.cos(time * 0.016) * 15}deg)`
        }}
      >
        {'()'}
      </div>

      {/* Floating Tacopii octopus emoji */}
      <div 
        className="absolute text-4xl animate-bounce select-none"
        style={{ 
          top: '65%', 
          left: '70%',
          animationDelay: '1.5s',
          opacity: 0.6,
          filter: `blur(${0.5 + Math.sin(time * 0.03) * 0.3}px)`,
          transform: `
            scale(${1 + Math.sin(time * 0.02) * 0.1}) 
            rotate(${Math.sin(time * 0.025) * 5}deg)
          `
        }}
      >
        🐙
      </div>

      {/* Content overlay */}
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>
    </div>
  )
}

export default EnhancedSpaceBackground