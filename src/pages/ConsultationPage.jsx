import { useState, useRef, useEffect } from 'react'
import { useConsultation } from '../hooks/useConsultation'
import LoadingSpinner, { MiniLoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorBoundary'
import OptimizedTerminalInput from '../components/OptimizedTerminalInput'
import ReactMarkdown from 'react-markdown'

const ConsultationPage = () => {
  const [message, setMessage] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  
  const { isLoading, error, sendMessage, clearError } = useConsultation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageHistory])

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage('')

    // Add user message to history
    const newUserMessage = {
      id: Date.now(),
      sender: 'user',
      message: userMessage,
      timestamp: new Date().toISOString()
    }

    setMessageHistory(prev => [...prev, newUserMessage])

    // Send to Tacopii
    const response = await sendMessage(userMessage, messageHistory)
    
    if (response.success) {
      const tacopiiMessage = {
        id: Date.now() + 1,
        sender: 'tacopii',
        message: response.consolation,
        timestamp: new Date().toISOString()
      }
      setMessageHistory(prev => [...prev, tacopiiMessage])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    setMessageHistory([])
    setMessage('')
    clearError()
  }

  const MessageBubble = ({ msg }) => {
    const isUser = msg.sender === 'user'
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
          <div
            className={`px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
              isUser
                ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-br-none border border-blue-300/30'
                : 'bg-white/10 border border-white/20 rounded-bl-none text-white'
            }`}
          >
            {isUser ? (
              <p className="text-sm">{msg.message}</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  components={{
                    p: ({ children }) => <p className="text-sm text-gray-700 mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>
                  }}
                >
                  {msg.message}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                🐙
              </div>
            )}
            <span className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString('ja-JP', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const WelcomeMessage = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4 animate-bounce">🐙💖</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        タコピーの癒し相談室っピ！
      </h2>
      <div className="max-w-md mx-auto space-y-3 text-gray-600">
        <p>辛いことがあったら、タコピーに話してねっピ！</p>
        <p>どんなことでも、タコピーが優しく聞いて、</p>
        <p>みんなをハッピーにしてあげるっピ〜✨</p>
      </div>
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 max-w-lg mx-auto">
        <p className="text-sm text-primary font-medium mb-2">💡 こんな時にどうぞっピ：</p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• コードレビューで凹んじゃった時</p>
          <p>• バグが直らなくて疲れた時</p>
          <p>• 開発で失敗して落ち込んだ時</p>
          <p>• なんだか元気が出ない時</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Premium Header */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 border-b border-white/20 px-6 py-6 shadow-2xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🐙💖</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                タコピーの癒し相談室
              </h1>
              <p className="text-sm text-gray-500">
                ハッピー星から愛をお届けっピ
              </p>
            </div>
          </div>
          
          {messageHistory.length > 0 && (
            <button
              onClick={clearConversation}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              🆕 新しい相談
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messageHistory.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <div className="space-y-1">
                {messageHistory.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Terminal Input Area */}
        <div className="px-4 py-6" style={{ background: 'rgba(13, 17, 23, 0.6)', backdropFilter: 'blur(20px)' }}>
          <div className="max-w-4xl mx-auto space-y-4">
            {error && (
              <div className="mb-4">
                <ErrorMessage 
                  error={error} 
                  onDismiss={clearError}
                  showRetry={false}
                />
              </div>
            )}
            
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <OptimizedTerminalInput
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="タコピーに相談したいことを書いてねっピ... (Shift+Enterで改行、Enterで送信)"
                  maxLength={2000}
                  disabled={isLoading}
                  rows={3}
                  terminalTitle="💖 Tacopii Consultation Terminal"
                  userName="troubled_coder"
                  directory="~/comfort-zone"
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                  !message.trim() || isLoading
                    ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-secondary to-pink-500 text-white border-secondary hover:from-pink-500 hover:to-secondary active:scale-95 shadow-lg hover:shadow-pink-500/25'
                }`}
                style={{
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                  boxShadow: !message.trim() || isLoading ? 'none' : '0 0 20px rgba(255, 105, 180, 0.4)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <MiniLoadingSpinner size="sm" />
                    <span>💭 考え中...</span>
                  </div>
                ) : (
                  '💖 相談送信'
                )}
              </button>
            </div>
            
            {/* Terminal Status Bar */}
            <div className="bg-gray-800 rounded-lg px-4 py-2 text-xs font-mono">
              <div className="flex justify-between items-center text-green-400">
                <div className="flex items-center space-x-4">
                  <span>🌟 Connection: Happy Star Network</span>
                  <span>💖 Mode: Comfort & Support</span>
                  {isLoading && <span className="animate-pulse">🐙 Tacopii is typing...</span>}
                </div>
                <div className="text-cyan-400">
                  {message.length}/2000 chars
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationPage