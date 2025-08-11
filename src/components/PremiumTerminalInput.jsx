import { useState, useEffect, useRef, forwardRef } from 'react'

const PremiumTerminalInput = forwardRef(({ 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Enter your message...", 
  disabled = false,
  maxLength,
  rows = 3,
  terminalTitle = "🐙 Tacopii Premium Terminal",
  userName = "happy_coder",
  directory = "~/tacopii-universe"
}, ref) => {
  const [currentTime, setCurrentTime] = useState('')
  const [cursorBlink, setCursorBlink] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glowIntensity, setGlowIntensity] = useState(0)
  const textareaRef = useRef(null)
  const terminalRef = useRef(null)

  // Forward ref to textarea
  if (ref) {
    ref.current = textareaRef.current
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorBlink(prev => !prev)
    }, 500)
    return () => clearInterval(cursorTimer)
  }, [])

  useEffect(() => {
    const glowTimer = setInterval(() => {
      setGlowIntensity(prev => 0.3 + 0.2 * Math.sin(Date.now() * 0.002))
    }, 50)
    return () => clearInterval(glowTimer)
  }, [])

  const handleMouseMove = (e) => {
    if (terminalRef.current) {
      const rect = terminalRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleTerminalClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      setIsActive(true)
    }
  }

  const handleFocus = () => setIsActive(true)
  const handleBlur = () => setIsActive(false)

  return (
    <div 
      ref={terminalRef}
      className={`premium-terminal rounded-3xl overflow-hidden transition-all duration-500 ${
        isActive ? 'scale-[1.01]' : 'scale-100'
      }`}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Premium glassmorphism header */}
      <div 
        className="px-6 py-4 border-b backdrop-blur-md"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(79, 172, 254, 0.1) 0%, 
              rgba(100, 181, 246, 0.05) 50%,
              rgba(79, 172, 254, 0.08) 100%
            )
          `,
          borderBottomColor: 'rgba(79, 172, 254, 0.2)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Premium window controls */}
            <div className="flex space-x-3">
              <div 
                className="w-4 h-4 rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  boxShadow: '0 0 10px rgba(255, 107, 107, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div 
                className="w-4 h-4 rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #FFD93D 0%, #FF9500 100%)',
                  boxShadow: '0 0 10px rgba(255, 217, 61, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <div 
                className="w-4 h-4 rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #6BCF7F 0%, #4D9DFF 100%)',
                  boxShadow: '0 0 10px rgba(107, 207, 127, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div 
                className="text-transparent bg-clip-text font-bold"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 50%, #2196F3 100%)'
                }}
              >
                {terminalTitle}
              </div>
              {isActive && (
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    boxShadow: `0 0 15px rgba(79, 172, 254, ${glowIntensity})`
                  }}
                />
              )}
            </div>
          </div>
          
          <div 
            className="px-3 py-1 rounded-lg font-mono text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#64B5F6'
            }}
          >
            {currentTime}
          </div>
        </div>
      </div>

      {/* Premium terminal content */}
      <div 
        className="p-6 font-mono text-sm cursor-text relative"
        onClick={handleTerminalClick}
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(79, 172, 254, 0.02) 0%, 
              transparent 200px
            ),
            linear-gradient(135deg, 
              rgba(13, 17, 23, 0.98) 0%, 
              rgba(22, 27, 34, 1) 50%,
              rgba(13, 17, 23, 0.98) 100%
            )
          `,
          minHeight: '160px'
        }}
      >
        {/* Holographic welcome message */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <span 
              className="text-3xl animate-bounce"
              style={{ 
                animationDuration: '3s',
                filter: 'drop-shadow(0 0 10px #FF69B4)'
              }}
            >
              🐙
            </span>
            <div>
              <span 
                className="font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 50%, #FF69B4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 5px rgba(79, 172, 254, 0.3))'
                }}
              >
                Tacopii Premium Terminal っピ!
              </span>
              <span 
                className="ml-2 animate-pulse"
                style={{
                  color: '#FFE66D',
                  filter: 'drop-shadow(0 0 8px #FFE66D)'
                }}
              >
                ✨
              </span>
            </div>
          </div>
          <div 
            className="text-xs ml-12"
            style={{ color: 'rgba(100, 181, 246, 0.6)' }}
          >
            🌟 Connected to Happy Star Quantum Network • Neural Shell v3.0 • Encryption: ❤️‍🔥
          </div>
        </div>

        {/* Enhanced command history */}
        <div className="mb-2 flex items-center">
          <span style={{ color: '#FFE66D' }} className="font-bold">{userName}</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>@</span>
          <span style={{ color: '#4FACFE' }} className="font-bold">quantum-star</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>:</span>
          <span style={{ color: '#81C784' }}>{directory}</span>
          <span style={{ color: '#4FACFE' }} className="font-bold">$ </span>
          <span style={{ color: '#CE93D8' }}>echo "Ready to create magic っピ!"</span>
        </div>
        <div 
          className="mb-4 ml-2 font-medium"
          style={{
            background: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Ready to create magic っピ! 💖✨
        </div>

        {/* Premium input line */}
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 select-none">
            <span style={{ color: '#FFE66D' }} className="font-bold">{userName}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>@</span>
            <span style={{ color: '#4FACFE' }} className="font-bold">quantum-star</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>:</span>
            <span style={{ color: '#81C784' }}>{directory}</span>
            <span style={{ color: '#4FACFE' }} className="font-bold">$ </span>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              maxLength={maxLength}
              rows={rows}
              placeholder={placeholder}
              className="w-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed placeholder-gray-500"
              style={{
                minHeight: `${rows * 1.6}rem`,
                color: '#4FACFE',
                textShadow: '0 0 10px rgba(79, 172, 254, 0.4)'
              }}
            />
            
            {/* Premium animated cursor */}
            {!disabled && isActive && (
              <div 
                className={`absolute top-0 w-2 h-6 rounded-sm pointer-events-none transition-opacity duration-200 ${
                  cursorBlink ? 'opacity-100' : 'opacity-20'
                }`}
                style={{
                  left: `${Math.min(value.length * 0.6, 50)}ch`,
                  background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                  boxShadow: `0 0 20px rgba(79, 172, 254, ${glowIntensity})`,
                  animation: 'premium-glow 2s ease-in-out infinite'
                }}
              />
            )}
          </div>
        </div>

        {/* Premium character counter */}
        {maxLength && (
          <div className="flex justify-end mt-3">
            <div 
              className={`text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm ${
                value.length > maxLength * 0.9 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : value.length > maxLength * 0.7 
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
              }`}
            >
              {value.length}/{maxLength}
            </div>
          </div>
        )}

        {/* Premium status bar */}
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    boxShadow: '0 0 8px rgba(79, 172, 254, 0.6)'
                  }}
                />
                <span style={{ color: '#4FACFE' }} className="font-medium">
                  Quantum Star Connected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💖</span>
                <span style={{ color: '#FF69B4' }}>Premium Comfort Mode</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🚀</span>
                <span style={{ color: '#81C784' }}>AI Enhanced</span>
              </div>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Enter to send • Shift+Enter for new line • Ctrl+K to clear
            </div>
          </div>
        </div>
      </div>

      {/* Premium holographic border effect */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl">
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `
              linear-gradient(135deg, 
                transparent 0%, 
                rgba(79, 172, 254, 0.1) 25%,
                rgba(255, 105, 180, 0.1) 50%,
                rgba(129, 199, 132, 0.1) 75%,
                transparent 100%
              )
            `,
            opacity: isActive ? 0.6 : 0.3,
            transition: 'opacity 0.5s ease',
            animation: isActive ? 'premium-glow 3s ease-in-out infinite' : 'none'
          }}
        />
      </div>

      {/* Dynamic light reflection */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden"
        style={{ opacity: isActive ? 0.2 : 0.1 }}
      >
        <div 
          className="absolute w-full h-full"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 0%,
                rgba(255, 255, 255, 0.1) 45%,
                rgba(255, 255, 255, 0.2) 50%,
                rgba(255, 255, 255, 0.1) 55%,
                transparent 100%
              )
            `,
            transform: `translateX(-100%) rotate(45deg)`,
            animation: isActive ? 'premium-shine 3s ease-in-out infinite' : 'none'
          }}
        />
      </div>
    </div>
  )
})

PremiumTerminalInput.displayName = 'PremiumTerminalInput'

export default PremiumTerminalInput