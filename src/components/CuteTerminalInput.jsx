import { useState, useEffect, useRef, forwardRef } from 'react'

const CuteTerminalInput = forwardRef(({ 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Enter your message...", 
  disabled = false,
  maxLength,
  rows = 3,
  terminalTitle = "🐙 Tacopii Terminal",
  userName = "happy_coder",
  directory = "~/tacopii-space"
}, ref) => {
  const [currentTime, setCurrentTime] = useState('')
  const [cursorBlink, setCursorBlink] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const textareaRef = useRef(null)

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
    }, 600)
    return () => clearInterval(cursorTimer)
  }, [])

  const handleTerminalClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      setIsActive(true)
    }
  }

  const handleFocus = () => setIsActive(true)
  const handleBlur = () => setIsActive(false)

  return (
    <div className={`terminal-cute-window rounded-2xl overflow-hidden transition-all duration-300 ${
      isActive ? 'ring-2 ring-pink-400 shadow-lg shadow-pink-400/25' : 'shadow-lg'
    }`}>
      {/* Glassmorphism terminal header */}
      <div 
        className="terminal-header px-4 py-3 border-b backdrop-blur-md"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(75, 85, 99, 0.9) 0%, 
              rgba(55, 65, 81, 0.95) 100%
            )
          `,
          borderBottomColor: 'rgba(156, 163, 175, 0.3)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Cute window controls */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-500 rounded-full shadow-sm"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-sm"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-500 rounded-full shadow-sm"></div>
            </div>
            
            <div className="text-white text-sm font-medium flex items-center space-x-2">
              <span>{terminalTitle}</span>
              {isActive && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
              )}
            </div>
          </div>
          
          <div className="text-gray-300 text-xs font-mono bg-gray-700/50 px-2 py-1 rounded">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Terminal content with beautiful gradients */}
      <div 
        className="terminal-content p-4 font-mono text-sm cursor-text"
        onClick={handleTerminalClick}
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(13, 17, 23, 0.95) 0%, 
              rgba(22, 27, 34, 0.98) 50%,
              rgba(13, 17, 23, 0.95) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(79, 209, 199, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.05) 0%, transparent 50%)
          `,
          minHeight: '140px'
        }}
      >
        {/* Welcome message with cute styling */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🐙</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 font-bold">
              Tacopii Happy Terminal っピ!
            </span>
            <span className="text-yellow-400 animate-pulse">✨</span>
          </div>
          <div className="text-xs text-gray-500 ml-8">
            🌟 Connected to Happy Star Network • Shell v2.0 💖
          </div>
        </div>

        {/* Previous command line */}
        <div className="text-gray-300 mb-1 flex items-center">
          <span className="text-yellow-400 font-semibold">{userName}</span>
          <span className="text-gray-500">@</span>
          <span className="text-cyan-400 font-semibold">happy-star</span>
          <span className="text-gray-500">:</span>
          <span className="text-blue-400">{directory}</span>
          <span className="text-green-400 font-bold">$ </span>
          <span className="text-purple-400">echo "Ready to help っピ!"</span>
        </div>
        <div className="text-green-300 mb-3 ml-2 font-medium">Ready to help っピ! 💖</div>

        {/* Current input line with improved styling */}
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 select-none">
            <span className="text-yellow-400 font-semibold">{userName}</span>
            <span className="text-gray-500">@</span>
            <span className="text-cyan-400 font-semibold">happy-star</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{directory}</span>
            <span className="text-green-400 font-bold">$ </span>
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
              className="w-full bg-transparent text-green-300 placeholder-gray-600 border-none outline-none resize-none font-mono text-sm leading-relaxed"
              style={{
                minHeight: `${rows * 1.5}rem`,
                textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
              }}
            />
            
            {/* Animated cursor with glow */}
            {!disabled && isActive && (
              <div 
                className={`absolute top-0 w-2 h-5 bg-green-400 rounded-sm pointer-events-none transition-opacity duration-100 ${
                  cursorBlink ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  left: `${Math.min(value.length * 0.6, 40)}ch`,
                  boxShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
                  animation: 'terminal-cursor-glow 2s ease-in-out infinite'
                }}
              />
            )}
          </div>
        </div>

        {/* Character counter with gradient */}
        {maxLength && (
          <div className="flex justify-end mt-2">
            <div className={`text-xs font-mono px-2 py-1 rounded ${
              value.length > maxLength * 0.9 
                ? 'bg-red-500/20 text-red-400' 
                : value.length > maxLength * 0.7 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {value.length}/{maxLength}
            </div>
          </div>
        )}

        {/* Beautiful status bar */}
        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                <span className="text-green-400 font-medium">Happy Star Connected</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-pink-400">💖</span>
                <span className="text-pink-400">Comfort Mode</span>
              </div>
            </div>
            <div className="text-gray-500">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>

      {/* Terminal glow effect */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl">
        <div 
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `
              linear-gradient(135deg, 
                transparent 0%, 
                rgba(79, 209, 199, 0.1) 30%,
                rgba(255, 105, 180, 0.1) 70%,
                transparent 100%
              )
            `,
            animation: isActive ? 'terminal-active-glow 3s ease-in-out infinite alternate' : 'none'
          }}
        />
      </div>
    </div>
  )
})

CuteTerminalInput.displayName = 'CuteTerminalInput'

export default CuteTerminalInput