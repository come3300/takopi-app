import { useState, useEffect, useRef, forwardRef } from 'react'

const TerminalInput = forwardRef(({ 
  value, 
  onChange, 
  onKeyDown, 
  placeholder = "Enter your message...", 
  disabled = false,
  maxLength,
  rows = 3,
  terminalTitle = "Tacopii Terminal",
  userName = "happy_coder",
  directory = "~/tacopii-space"
}, ref) => {
  const [currentTime, setCurrentTime] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const terminalRef = useRef(null)
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
      setCursorVisible(prev => !prev)
    }, 800)
    
    return () => clearInterval(cursorTimer)
  }, [])

  const handleTerminalClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const getPrompt = () => {
    return `[tacopii@happy-star ${directory}]$ `
  }

  return (
    <div className="terminal-window bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
      {/* Terminal Header */}
      <div className="terminal-header bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {/* Window Controls */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="text-gray-300 text-sm font-medium ml-4">
            {terminalTitle}
          </div>
        </div>
        
        <div className="text-gray-400 text-xs font-mono">
          {currentTime}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="terminal-content bg-gray-900 p-4 font-mono text-sm min-h-[120px] cursor-text"
        onClick={handleTerminalClick}
        style={{
          background: `
            linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.03) 50%, transparent 100%),
            radial-gradient(circle at center, rgba(0, 255, 0, 0.01) 0%, transparent 70%),
            #0d1117
          `,
          textShadow: '0 0 5px rgba(0, 255, 0, 0.3)'
        }}
      >
        {/* Welcome Message */}
        <div className="text-green-400 mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">🐙</span>
            <span>Welcome to Tacopii Happy Terminal っピ!</span>
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Connected to Happy Star Network • Secure Shell v2.0
          </div>
        </div>

        {/* Command History */}
        <div className="text-gray-300 mb-1">
          <span className="text-yellow-400">{userName}</span>
          <span className="text-gray-500">@</span>
          <span className="text-cyan-400">happy-star</span>
          <span className="text-gray-500">:</span>
          <span className="text-blue-400">{directory}</span>
          <span className="text-green-400">$ </span>
          <span className="text-purple-400">echo "Ready to help you っピ!"</span>
        </div>
        <div className="text-green-300 mb-3 ml-2">Ready to help you っピ!</div>

        {/* Current Input Line */}
        <div className="flex items-start">
          <div className="flex-shrink-0 text-green-400 select-none">
            <span className="text-yellow-400">{userName}</span>
            <span className="text-gray-500">@</span>
            <span className="text-cyan-400">happy-star</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{directory}</span>
            <span className="text-green-400">$ </span>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              disabled={disabled}
              maxLength={maxLength}
              rows={rows}
              placeholder={placeholder}
              className="w-full bg-transparent text-green-300 placeholder-gray-600 border-none outline-none resize-none font-mono text-sm leading-relaxed"
              style={{
                minHeight: `${rows * 1.5}rem`,
                textShadow: '0 0 5px rgba(0, 255, 0, 0.3)'
              }}
            />
            
            {/* Animated cursor */}
            {!disabled && (
              <div 
                className={`absolute top-0 w-2 h-5 bg-green-400 pointer-events-none ${
                  cursorVisible ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-100`}
                style={{
                  left: `${value.length * 0.6}ch`,
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)'
                }}
              />
            )}
          </div>
        </div>

        {/* Character counter */}
        {maxLength && (
          <div className="flex justify-end mt-2">
            <span className={`text-xs font-mono ${
              value.length > maxLength * 0.9 
                ? 'text-red-400' 
                : value.length > maxLength * 0.7 
                ? 'text-yellow-400' 
                : 'text-gray-500'
            }`}>
              {value.length}/{maxLength}
            </span>
          </div>
        )}

        {/* System info */}
        <div className="mt-3 text-xs text-gray-600 border-t border-gray-800 pt-2">
          <div className="flex justify-between">
            <span>🌟 Status: Connected to Happy Star</span>
            <span>💖 Mode: Comfort & Joy</span>
          </div>
        </div>
      </div>

      {/* Terminal glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(0, 255, 0, 0.05) 50%, transparent 100%)',
            animation: 'terminal-glow 3s ease-in-out infinite alternate'
          }}
        />
      </div>
    </div>
  )
})

TerminalInput.displayName = 'TerminalInput'

export default TerminalInput