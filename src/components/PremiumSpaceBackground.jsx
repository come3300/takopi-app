import { useEffect, useState, useCallback, useRef } from 'react'

const PremiumSpaceBackground = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [time, setTime] = useState(0)
  const [stars, setStars] = useState([])
  const [nebulae, setNebulae] = useState([])
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Initialize premium star field
  useEffect(() => {
    const generatePremiumStars = () => {
      const starArray = []
      for (let i = 0; i < 150; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          color: Math.random() > 0.7 ? ['#64B5F6', '#81C784', '#FFB74D', '#F48FB1'][Math.floor(Math.random() * 4)] : '#FFFFFF',
          depth: Math.random() * 3 + 1
        })
      }
      setStars(starArray)
    }

    const generateNebulae = () => {
      const nebulaArray = []
      for (let i = 0; i < 5; i++) {
        nebulaArray.push({
          id: i,
          x: Math.random() * 120 - 10,
          y: Math.random() * 120 - 10,
          size: 40 + Math.random() * 60,
          opacity: 0.15 + Math.random() * 0.25,
          color: ['#4A90E2', '#7B68EE', '#FF6B9D', '#4ECDC4', '#A8E6CF'][i],
          rotationSpeed: 0.1 + Math.random() * 0.3,
          pulsePhase: Math.random() * Math.PI * 2
        })
      }
      setNebulae(nebulaArray)
    }

    generatePremiumStars()
    generateNebulae()
  }, [])

  // High-performance animation loop
  useEffect(() => {
    let startTime = Date.now()
    let lastTime = 0
    
    const animate = (currentTime) => {
      // Throttle to ~30fps for better performance
      if (currentTime - lastTime > 33) {
        setTime((currentTime - startTime) * 0.001)
        lastTime = currentTime
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (typeof window === 'undefined') return
    
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Premium floating planet component
  const PremiumPlanet = ({ 
    className, 
    style, 
    children, 
    orbitRadius = 8, 
    orbitSpeed = 0.3,
    baseX, 
    baseY,
    gradient,
    shadowColor,
    ringColor,
    hasRing = false,
    ringAngle = 0
  }) => {
    const orbitX = Math.cos(time * orbitSpeed) * orbitRadius
    const orbitY = Math.sin(time * orbitSpeed) * orbitRadius * 0.6
    const parallaxX = (mousePosition.x - 50) * 0.02
    const parallaxY = (mousePosition.y - 50) * 0.02
    const breathe = 1 + Math.sin(time * 0.5) * 0.05

    return (
      <div
        className={`absolute rounded-full ${className}`}
        style={{
          ...style,
          left: `${baseX + orbitX}%`,
          top: `${baseY + orbitY}%`,
          transform: `
            translate(${parallaxX}px, ${parallaxY}px) 
            scale(${breathe})
          `,
          background: gradient,
          boxShadow: `
            0 0 40px ${shadowColor}40,
            0 0 80px ${shadowColor}20,
            inset -5px -5px 15px rgba(0,0,0,0.3),
            inset 5px 5px 15px rgba(255,255,255,0.1)
          `,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {hasRing && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-4 opacity-60"
              style={{
                borderColor: ringColor,
                transform: `rotate(${ringAngle}deg) scale(1.4)`,
                filter: `drop-shadow(0 0 10px ${ringColor})`
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 opacity-30"
              style={{
                borderColor: ringColor,
                transform: `rotate(${ringAngle}deg) scale(1.6)`,
                filter: `drop-shadow(0 0 5px ${ringColor})`
              }}
            />
          </>
        )}
        
        {/* Surface details */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 40%)
              `
            }}
          />
          {children}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Premium fixed background layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep space gradient with dynamic lighting */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(88, 166, 255, 0.12) 0%, 
                rgba(140, 69, 255, 0.08) 30%,
                transparent 70%
              ),
              radial-gradient(ellipse 80% 60% at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
                rgba(255, 105, 180, 0.06) 0%, 
                transparent 50%
              ),
              linear-gradient(135deg, 
                #0a0a1a 0%, 
                #1a0a2e 15%,
                #2d1b3d 30%,
                #1e1a2e 50%,
                #0f0a1a 70%,
                #000 100%
              )
            `
          }}
        />

        {/* Advanced nebula clouds */}
        {nebulae.map((nebula) => (
          <div
            key={nebula.id}
            className="absolute rounded-full"
            style={{
              left: `${nebula.x}%`,
              top: `${nebula.y}%`,
              width: `${nebula.size}vw`,
              height: `${nebula.size * 0.7}vh`,
              background: `
                radial-gradient(ellipse closest-side, 
                  ${nebula.color}${Math.floor((nebula.opacity + Math.sin(time + nebula.pulsePhase) * 0.1) * 255).toString(16).padStart(2, '0')} 0%,
                  ${nebula.color}20 40%,
                  transparent 70%
                )
              `,
              transform: `rotate(${time * nebula.rotationSpeed * 10}deg)`,
              filter: 'blur(1px)',
              mixBlendMode: 'screen'
            }}
          />
        ))}

        {/* Premium star field */}
        {stars.map((star) => {
          const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase)
          const parallax = (mousePosition.x - 50) * (star.depth * 0.005) + (mousePosition.y - 50) * (star.depth * 0.003)
          
          return (
            <div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `calc(${star.x}% + ${parallax}px)`,
                top: `calc(${star.y}% + ${parallax * 0.7}px)`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                opacity: star.opacity * twinkle,
                boxShadow: `
                  0 0 ${star.size * 4}px ${star.color},
                  0 0 ${star.size * 8}px ${star.color}40
                `,
                transform: `scale(${0.5 + twinkle * 0.5})`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          )
        })}

        {/* Sophisticated shooting stars */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute opacity-80"
            style={{
              top: `${15 + i * 30}%`,
              left: '-20px',
              width: '200px',
              height: '2px',
              background: `
                linear-gradient(90deg, 
                  transparent 0%,
                  #ffffff 20%,
                  #64B5F6 50%,
                  #ffffff 80%,
                  transparent 100%
                )
              `,
              animation: `premium-shooting-star ${12 + i * 3}s linear infinite`,
              animationDelay: `${i * 4}s`,
              filter: 'blur(0.5px)',
              transform: 'rotate(-15deg)'
            }}
          />
        ))}

        {/* Premium planets with sophisticated design */}
        <PremiumPlanet
          className="w-36 h-36"
          baseX={12}
          baseY={20}
          orbitRadius={10}
          orbitSpeed={0.2}
          gradient="linear-gradient(135deg, #4FACFE 0%, #00F2FE 50%, #4FACFE 100%)"
          shadowColor="#4FACFE"
          ringColor="#B794F6"
          hasRing={true}
          ringAngle={-15}
        >
          <div className="absolute top-4 left-6 w-4 h-4 bg-white/40 rounded-full blur-sm" />
          <div className="absolute bottom-6 right-4 w-2 h-2 bg-cyan-200/60 rounded-full" />
        </PremiumPlanet>

        <PremiumPlanet
          className="w-28 h-28"
          baseX={75}
          baseY={15}
          orbitRadius={6}
          orbitSpeed={0.4}
          gradient="linear-gradient(135deg, #FA709A 0%, #FEE140 50%, #FA709A 100%)"
          shadowColor="#FA709A"
        >
          <div className="absolute top-3 left-5 w-3 h-3 bg-white/50 rounded-full blur-sm" />
        </PremiumPlanet>

        <PremiumPlanet
          className="w-24 h-24"
          baseX={85}
          baseY={70}
          orbitRadius={4}
          orbitSpeed={0.6}
          gradient="linear-gradient(135deg, #A8EDEA 0%, #FED6E3 50%, #A8EDEA 100%)"
          shadowColor="#A8EDEA"
        />

        <PremiumPlanet
          className="w-32 h-32"
          baseX={8}
          baseY={65}
          orbitRadius={8}
          orbitSpeed={0.3}
          gradient="linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #667EEA 100%)"
          shadowColor="#667EEA"
          ringColor="#FFE66D"
          hasRing={true}
          ringAngle={25}
        />

        <PremiumPlanet
          className="w-20 h-20"
          baseX={60}
          baseY={85}
          orbitRadius={5}
          orbitSpeed={0.8}
          gradient="linear-gradient(135deg, #FFE66D 0%, #FF6B9D 50%, #FFE66D 100%)"
          shadowColor="#FFE66D"
        />

        {/* Interactive premium elements */}
        {[
          { symbol: '</>', x: 25, y: 25, color: '#64B5F6', scale: 1.2 },
          { symbol: '{}', x: 70, y: 15, color: '#81C784', scale: 1.1 },
          { symbol: '[]', x: 15, y: 75, color: '#FFB74D', scale: 1.0 },
          { symbol: '=>', x: 80, y: 80, color: '#F48FB1', scale: 1.3 },
          { symbol: '&&', x: 90, y: 40, color: '#CE93D8', scale: 1.1 },
        ].map((item, index) => {
          const distance = Math.sqrt(
            Math.pow(mousePosition.x - item.x, 2) + 
            Math.pow(mousePosition.y - item.y, 2)
          )
          const proximity = Math.max(0, 1 - distance / 30)
          const hoverScale = 1 + proximity * 0.5
          const hoverGlow = proximity * 20
          
          return (
            <div
              key={index}
              className="absolute font-mono font-bold text-2xl select-none cursor-pointer"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                color: item.color,
                transform: `
                  translate(-50%, -50%)
                  scale(${item.scale * hoverScale * (0.9 + 0.1 * Math.sin(time + index))})
                  rotate(${Math.sin(time * 0.3 + index) * 5}deg)
                `,
                textShadow: `
                  0 0 ${10 + hoverGlow}px ${item.color},
                  0 0 ${20 + hoverGlow}px ${item.color}80,
                  0 2px 4px rgba(0,0,0,0.5)
                `,
                opacity: 0.6 + proximity * 0.4,
                filter: `blur(${Math.max(0, 1 - proximity)}px)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: `premium-float ${4 + index}s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              {item.symbol}
            </div>
          )
        })}

        {/* Premium Tacopii */}
        <div
          className="absolute text-4xl select-none cursor-pointer"
          style={{
            top: '45%',
            right: '10%',
            transform: `
              translate(${(mousePosition.x - 50) * 0.03}px, ${(mousePosition.y - 50) * 0.03}px)
              scale(${1 + Math.sin(time * 0.5) * 0.1})
              rotate(${Math.sin(time * 0.3) * 3}deg)
            `,
            filter: `
              drop-shadow(0 0 20px #FF69B4)
              drop-shadow(0 0 40px #FF69B480)
              drop-shadow(0 4px 8px rgba(0,0,0,0.3))
            `,
            animation: 'premium-float 6s ease-in-out infinite',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          🐙✨
        </div>

        {/* Dynamic light rays */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              conic-gradient(from ${time * 20}deg at ${mousePosition.x}% ${mousePosition.y}%,
                transparent 0deg,
                rgba(255, 255, 255, 0.05) 60deg,
                transparent 120deg,
                rgba(100, 181, 246, 0.03) 180deg,
                transparent 240deg,
                rgba(255, 105, 180, 0.03) 300deg,
                transparent 360deg
              )
            `,
            mixBlendMode: 'screen'
          }}
        />
      </div>
      
      {/* Premium scrollable content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}

export default PremiumSpaceBackground