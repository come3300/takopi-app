import { useState, memo, useMemo, lazy, Suspense } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorBoundary'
import useAIReview from '../hooks/useAIReview'
import { useSettings } from '../hooks/useLocalStorage'

// Lazy load heavy components with terminal design
const TerminalFileUploader = lazy(() => import('../components/TerminalFileUploader'))
const TerminalCodeEditor = lazy(() => import('../components/TerminalCodeEditor'))
const ReviewDisplay = lazy(() => import('../components/ReviewDisplay'))
const SettingsPanel = lazy(() => import('../components/SettingsPanel'))

const HomePage = memo(() => {
  const [currentCode, setCurrentCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [activeTab, setActiveTab] = useState('upload')
  
  const { settings } = useSettings()
  const { review, isLoading, error, reviewMetadata, generateReview, clearReview, clearError } = useAIReview()

  const handleStartReview = async () => {
    if (!currentCode.trim()) return

    const reviewData = {
      code: currentCode,
      fileName: fileName || 'untitled',
      language: language,
      reviewLevel: settings.reviewLevel || 3,
      focusAreas: settings.focusAreas || ['logic', 'security', 'readability']
    }

    await generateReview(reviewData)
  }

  // Memoize expensive computations
  const hasCode = useMemo(() => currentCode.trim().length > 0, [currentCode])
  const canStartReview = useMemo(() => hasCode && !isLoading, [hasCode, isLoading])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 50%, #FF69B4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(79, 172, 254, 0.5))'
        }}>
          🐙 タコピーAIコードレビューっピ！
        </h1>
        <p className="text-xl font-medium" style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #E3F2FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
        }}>
          ハッピー星から来たタコピーが、あなたのコードを優しくレビューするっピ！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="premium-glass rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">
            <div className="flex space-x-2 mb-6">
              <button
                className={`px-4 py-3 font-mono font-medium rounded-xl transition-all duration-200 border ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-400 shadow-lg shadow-green-500/25'
                    : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                <span className="flex items-center space-x-2">
                  <span>📁</span>
                  <span>./upload_files</span>
                </span>
              </button>
              <button
                className={`px-4 py-3 font-mono font-medium rounded-xl transition-all duration-200 border ${
                  activeTab === 'editor'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                    : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                <span className="flex items-center space-x-2">
                  <span>✏️</span>
                  <span>./code_editor</span>
                </span>
              </button>
            </div>

            <Suspense fallback={<div className="h-32 flex items-center justify-center text-white/60 font-mono">Loading terminal っピ...</div>}>
              {activeTab === 'upload' ? (
                <TerminalFileUploader
                  onFileSelect={(code, name, lang) => {
                    setCurrentCode(code)
                    setFileName(name)
                    setLanguage(lang)
                  }}
                />
              ) : (
                <TerminalCodeEditor
                  code={currentCode}
                  fileName={fileName}
                  language={language}
                  onCodeChange={setCurrentCode}
                  onFileNameChange={setFileName}
                  onLanguageChange={setLanguage}
                />
              )}
            </Suspense>
          </div>

          <Suspense fallback={<div className="h-20 premium-glass rounded-3xl animate-pulse"></div>}>
            <SettingsPanel />
          </Suspense>
          
          <div 
            className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
              border: '1px solid rgba(79, 172, 254, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
          >
            <div className="font-mono mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🐙</span>
                <span className="text-cyan-400 font-bold">TACOPII_REVIEW_SYSTEM</span>
                <span className="text-green-400">v2.0</span>
              </div>
              <div className="text-xs text-gray-500">
                📊 Ready to analyze your code • AI-powered review engine
              </div>
            </div>
            
            <button
              onClick={handleStartReview}
              disabled={!canStartReview}
              className={`w-full py-4 px-6 rounded-xl font-mono font-bold text-lg transition-all duration-200 border-2 ${
                !canStartReview
                  ? 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white border-green-400 hover:shadow-xl hover:shadow-green-500/25 active:scale-95 animate-pulse'
              }`}
              style={{
                textShadow: !canStartReview ? 'none' : '0 0 10px rgba(255, 255, 255, 0.5)',
                animation: !canStartReview ? 'none' : 'pulse 2s infinite'
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin">⚙️</div>
                  <span>$ ./analyzing_code --deep-scan</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <span>🚀</span>
                  <span>$ ./start_review --tacopii-mode</span>
                </div>
              )}
            </button>
            
            {!canStartReview && (
              <div className="mt-3 text-center">
                <p className="text-yellow-400 text-sm font-mono">
                  <span className="animate-pulse">[WARNING]</span> No code detected - please upload or write code first っピ
                </p>
              </div>
            )}
          </div>
        </div>

        <div 
          className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(79, 172, 254, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
          }}
        >
          <div 
            className="px-6 py-4 border-b"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)',
              borderBottomColor: 'rgba(79, 172, 254, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white font-mono font-bold">🐙 tacopii_review_output.txt</span>
              </div>
              
              {review && (
                <button
                  onClick={clearReview}
                  className="text-gray-400 hover:text-red-400 transition-colors font-mono text-sm px-2 py-1 rounded border border-gray-600 hover:border-red-500"
                  title="Clear review"
                >
                  [CLEAR]
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 font-mono" style={{ background: 'rgba(13, 17, 23, 0.98)' }}>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage 
                error={error} 
                onRetry={handleStartReview}
                onDismiss={clearError}
              />
            </div>
          )}
          
          <Suspense fallback={
            <div className="h-32 flex items-center justify-center text-white/60 font-mono">
              <div className="flex items-center space-x-3">
                <div className="animate-spin text-cyan-400">⚙️</div>
                <span className="text-cyan-400">$ ./loading_review_system っピ...</span>
              </div>
            </div>
          }>
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl animate-bounce">🐙</span>
                  <span className="text-cyan-400 font-bold">TACOPII_ANALYSIS_ENGINE</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-yellow-400">tacopii@analyzer:</span>
                    <span className="text-blue-400">~/review</span>
                    <span className="text-green-400">$</span>
                    <span className="text-purple-400">./deep_code_analysis --verbose</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="text-green-400">
                      <span className="animate-pulse">[INFO]</span> Initializing AI review engine っピ...
                    </div>
                    <div className="text-cyan-400">
                      <span className="animate-pulse">[SCAN]</span> Analyzing code structure and patterns...
                    </div>
                    <div className="text-yellow-400">
                      <span className="animate-pulse">[CHECK]</span> Running security and quality checks...
                    </div>
                    <div className="text-pink-400">
                      <span className="animate-pulse">[PROC]</span> {isLoading ? "タコピーがコードを見てるっピ..." : "Processing complete!"}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                    <span className="text-gray-400 text-xs">Processing... Please wait っピ</span>
                  </div>
                </div>
              </div>
            ) : review ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <span className="text-green-400 font-bold">REVIEW_COMPLETED</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-yellow-400">tacopii@analyzer:</span>
                    <span className="text-blue-400">~/review</span>
                    <span className="text-green-400">$</span>
                    <span className="text-purple-400">cat review_results.txt</span>
                  </div>
                  
                  <div className="text-green-400 text-sm mb-3">
                    [SUCCESS] Analysis complete! Results ready for display っピ ✨
                  </div>
                </div>
                
                <ReviewDisplay review={review} metadata={reviewMetadata} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="text-6xl mb-4 animate-bounce">🐙</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-yellow-400">happy_coder</span>
                      <span className="text-gray-500">@</span>
                      <span className="text-cyan-400">tacopii-terminal</span>
                      <span className="text-gray-500">:</span>
                      <span className="text-blue-400">~/workspace</span>
                      <span className="text-green-400 font-bold">$ </span>
                    </div>
                    <div className="text-white/80 bg-gray-800/50 p-4 rounded-lg border border-gray-600 inline-block">
                      <p className="mb-2">echo "Welcome to Tacopii Code Review っピ!"</p>
                      <p className="text-cyan-400">Welcome to Tacopii Code Review っピ!</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-600 text-left">
                    <p className="text-green-400 mb-1">
                      <span className="text-yellow-400">[STEP 1]:</span> Upload or write your code
                    </p>
                    <p className="text-blue-400 mb-1">
                      <span className="text-yellow-400">[STEP 2]:</span> Click "レビュー開始っピ！" button
                    </p>
                    <p className="text-purple-400">
                      <span className="text-yellow-400">[STEP 3]:</span> Get amazing AI review results!
                    </p>
                  </div>
                  
                  {!hasCode && (
                    <div className="bg-amber-900/20 p-3 rounded-lg border border-amber-500/30">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">💡</span>
                        <span className="text-amber-400 font-bold">TIP:</span>
                      </div>
                      <p className="text-amber-300 text-sm mt-1">
                        まずはコードを入力してくださいっピ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Suspense>
        </div>
        </div>
      </div>
    </div>
  )
})

HomePage.displayName = 'HomePage'

export default HomePage