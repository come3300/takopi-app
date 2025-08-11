import { useState, useEffect, useRef, forwardRef, memo } from 'react'

const OptimizedTerminalInput = memo(forwardRef(({ 
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

  // 時刻更新を1秒間隔に最適化
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

  // カーソル点滅を軽量化
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorBlink(prev => !prev)
    }, 800)
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
    <div 
      className={`rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
        isActive ? 'shadow-lg shadow-blue-500/20' : 'shadow-md'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
        border: `1px solid ${isActive ? 'rgba(79, 172, 254, 0.3)' : 'rgba(75, 85, 99, 0.2)'}`,
      }}
    >
      {/* 最適化されたヘッダー */}
      <div 
        className="px-4 py-3 border-b"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)',
          borderBottomColor: 'rgba(79, 172, 254, 0.2)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* シンプルなウィンドウコントロール */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            
            <div className="text-white text-sm font-medium">
              {terminalTitle}
            </div>
            
            {isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <div className="text-gray-400 text-xs font-mono bg-gray-700/50 px-2 py-1 rounded">
            {currentTime}
          </div>
        </div>
      </div>

      {/* 最適化されたコンテンツ */}
      <div 
        className="p-4 font-mono text-sm cursor-text"
        onClick={handleTerminalClick}
        style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98) 0%, rgba(22, 27, 34, 1) 100%)',
          minHeight: '120px'
        }}
      >
        {/* シンプルなウェルカムメッセージ */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl">🐙</span>
            <span className="text-cyan-400 font-bold">Tacopii Terminal っピ!</span>
            <span className="text-yellow-400">✨</span>
          </div>
          <div className="text-xs text-gray-500 ml-8">
            🌟 Happy Star Network • Ready to help!
          </div>
        </div>

        {/* 軽量化された入力行 */}
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0 select-none text-green-400">
            <span className="text-yellow-400">{userName}</span>
            <span className="text-gray-500">@</span>
            <span className="text-cyan-400">happy-star</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{directory}</span>
            <span className="font-bold">$ </span>
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
                textShadow: '0 0 5px rgba(34, 197, 94, 0.3)'
              }}
            />
            
            {/* シンプルなカーソル */}
            {!disabled && isActive && (
              <div 
                className={`absolute top-0 w-2 h-5 bg-green-400 pointer-events-none transition-opacity duration-200 ${
                  cursorBlink ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  left: `${Math.min(value.length * 0.6, 40)}ch`,
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
                }}
              />
            )}
          </div>
        </div>

        {/* 文字カウンター */}
        {maxLength && (
          <div className="flex justify-end mt-2">
            <div className={`text-xs px-2 py-1 rounded ${
              value.length > maxLength * 0.9 
                ? 'text-red-400' 
                : value.length > maxLength * 0.7 
                ? 'text-yellow-400' 
                : 'text-gray-500'
            }`}>
              {value.length}/{maxLength}
            </div>
          </div>
        )}

        {/* シンプルなステータスバー */}
        <div className="mt-3 pt-2 border-t border-gray-700/30 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-green-400">⚡ Connected</span>
              <span className="text-pink-400">💖 Comfort Mode</span>
            </div>
            <div>
              Enter to send • Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}))

OptimizedTerminalInput.displayName = 'OptimizedTerminalInput'

export default OptimizedTerminalInput