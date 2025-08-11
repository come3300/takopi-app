import { useState, useRef, useEffect, memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { detectLanguage, getSyntaxHighlightLanguage, getLanguageDisplayName } from '../utils/languageDetector'
import { analyzeCodeStructure, validateCode } from '../utils/fileParser'

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'kotlin', 'c', 'cpp', 
  'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'dart', 'html', 
  'css', 'scss', 'json', 'xml', 'yaml', 'sql', 'bash', 'markdown'
]

const TerminalCodeEditor = memo(({ 
  code, 
  fileName, 
  language, 
  onCodeChange, 
  onFileNameChange, 
  onLanguageChange 
}) => {
  const [currentTime, setCurrentTime] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [codeStats, setCodeStats] = useState(null)
  const [validationIssues, setValidationIssues] = useState([])
  const [cursorBlink, setCursorBlink] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const textareaRef = useRef(null)

  // 時刻更新
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

  // カーソル点滅
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorBlink(prev => !prev)
    }, 800)
    return () => clearInterval(cursorTimer)
  }, [])

  // コード分析
  useEffect(() => {
    if (code) {
      const stats = analyzeCodeStructure(code, language)
      const issues = validateCode(code, language)
      setCodeStats(stats)
      setValidationIssues(issues)
    } else {
      setCodeStats(null)
      setValidationIssues([])
    }
  }, [code, language])

  const handleCodeChange = (e) => {
    const newCode = e.target.value
    onCodeChange(newCode)
  }

  const handleFileNameChange = (e) => {
    const newFileName = e.target.value
    onFileNameChange(newFileName)
    
    if (newFileName) {
      const detectedLang = detectLanguage(newFileName)
      if (detectedLang !== language) {
        onLanguageChange(detectedLang)
      }
    }
  }

  const handleLanguageChange = (e) => {
    onLanguageChange(e.target.value)
  }

  const insertTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = code.substring(0, start) + '  ' + code.substring(end)
      onCodeChange(newValue)
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  const formatCode = () => {
    let formatted = code
    
    switch (language) {
      case 'javascript':
      case 'typescript':
        formatted = code
          .replace(/;(\w)/g, ';\n$1')
          .replace(/{(\w)/g, '{\n  $1')
          .replace(/}(\w)/g, '}\n$1')
        break
      case 'json':
        try {
          formatted = JSON.stringify(JSON.parse(code), null, 2)
        } catch (e) {
          // Keep original if JSON is invalid
        }
        break
    }
    
    onCodeChange(formatted)
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
    <div className="space-y-6">
      {/* ターミナルスタイルの入力フィールド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ファイル名入力ターミナル */}
        <div 
          className="rounded-xl overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.2)',
          }}
        >
          <div 
            className="px-3 py-2 border-b"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)',
              borderBottomColor: 'rgba(79, 172, 254, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">📁 filename.terminal</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 font-mono text-sm" style={{ background: 'rgba(13, 17, 23, 0.98)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400">tacopii@coder</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~/project</span>
              <span className="text-green-400">$</span>
              <span className="text-purple-400">touch</span>
            </div>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={handleFileNameChange}
              placeholder="app.js, main.py, index.html..."
              className="w-full bg-transparent text-green-300 placeholder-gray-600 border-none outline-none font-mono text-sm"
              style={{ textShadow: '0 0 5px rgba(34, 197, 94, 0.3)' }}
            />
          </div>
        </div>

        {/* 言語選択ターミナル */}
        <div 
          className="rounded-xl overflow-hidden backdrop-blur-md"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.2)',
          }}
        >
          <div 
            className="px-3 py-2 border-b"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)',
              borderBottomColor: 'rgba(79, 172, 254, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs">⚡ language.config</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 font-mono text-sm" style={{ background: 'rgba(13, 17, 23, 0.98)' }}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-400">tacopii@coder</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~/config</span>
              <span className="text-green-400">$</span>
              <span className="text-purple-400">select</span>
            </div>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-transparent text-green-300 border-none outline-none font-mono text-sm"
              style={{ textShadow: '0 0 5px rgba(34, 197, 94, 0.3)' }}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang} value={lang} className="bg-gray-800 text-green-300">
                  {getLanguageDisplayName(lang)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* コントロールパネル */}
      <div 
        className="rounded-xl overflow-hidden backdrop-blur-md p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
          border: '1px solid rgba(75, 85, 99, 0.2)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 text-sm rounded-lg font-mono transition-all duration-200 ${
                showPreview 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {showPreview ? '📝 EDIT_MODE' : '👁️ PREVIEW_MODE'}
            </button>
            
            <button
              onClick={formatCode}
              disabled={!code}
              className="px-4 py-2 text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-mono"
            >
              ✨ FORMAT_CODE
            </button>
          </div>

          {codeStats && (
            <div className="text-sm text-cyan-400 font-mono">
              <span className="text-green-400">STATS:</span> {codeStats.lines}L • {codeStats.characters}C
              {codeStats.functions > 0 && <span className="text-yellow-400"> • {codeStats.functions}F</span>}
              {codeStats.classes > 0 && <span className="text-pink-400"> • {codeStats.classes}CL</span>}
            </div>
          )}
        </div>
      </div>

      {/* メインコードエディタ */}
      <div 
        className={`rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
          isActive ? 'shadow-lg shadow-blue-500/20' : 'shadow-md'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
          border: `1px solid ${isActive ? 'rgba(79, 172, 254, 0.3)' : 'rgba(75, 85, 99, 0.2)'}`,
        }}
      >
        {/* ターミナルヘッダー */}
        <div 
          className="px-4 py-3 border-b"
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
              
              <div className="text-white text-sm font-medium flex items-center space-x-2">
                <span>🐙 Tacopii Code Terminal</span>
                {isActive && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            <div className="text-gray-400 text-xs font-mono bg-gray-700/50 px-2 py-1 rounded">
              {currentTime}
            </div>
          </div>
        </div>

        {/* ターミナルコンテンツ */}
        {showPreview ? (
          <div className="p-4 font-mono text-sm" style={{ background: 'rgba(13, 17, 23, 0.98)' }}>
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🐙</span>
                <span className="text-cyan-400 font-bold">Code Preview っピ!</span>
                <span className="text-yellow-400">✨</span>
              </div>
              <div className="text-xs text-gray-500">
                📄 {fileName || 'untitled'} • {getLanguageDisplayName(language)}
              </div>
            </div>
            
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={getSyntaxHighlightLanguage(language)}
                style={tomorrow}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  background: '#1a1a1a',
                  fontSize: '13px',
                  maxHeight: '400px'
                }}
              >
                {code || '// コードを入力してくださいっピ'}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div 
            className="p-4 font-mono text-sm cursor-text"
            onClick={handleTerminalClick}
            style={{ background: 'rgba(13, 17, 23, 0.98)' }}
          >
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🐙</span>
                <span className="text-cyan-400 font-bold">Tacopii Code Editor っピ!</span>
                <span className="text-yellow-400">✨</span>
              </div>
              <div className="text-xs text-gray-500">
                💻 Ready for coding • Press Tab for indentation
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">happy_coder</span>
                <span className="text-gray-500">@</span>
                <span className="text-cyan-400">tacopii-dev</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400">~/workspace</span>
                <span className="text-green-400 font-bold">$ </span>
                <span className="text-purple-400">vim {fileName || 'new_file.js'}</span>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                onKeyDown={insertTab}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="ここにコードを入力してくださいっピ！

例：
function hello() {
  console.log('Hello, Tacopii! っピ')
  return 'Ready to review!'
}"
                className="w-full h-80 bg-transparent text-green-300 placeholder-gray-600 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                style={{
                  textShadow: '0 0 5px rgba(34, 197, 94, 0.3)'
                }}
              />
            </div>

            <div className="mt-3 pt-2 border-t border-gray-700/30 text-xs text-gray-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-green-400">⚡ Terminal Active</span>
                  <span className="text-cyan-400">🎯 {getLanguageDisplayName(language)}</span>
                </div>
                <div>
                  Tab for indent • Ctrl+A to select all
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 検証結果表示 */}
      {validationIssues.length > 0 && (
        <div 
          className="rounded-xl p-4 space-y-3"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.2)',
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔍</span>
            <h4 className="font-mono text-cyan-400 font-bold">CODE_ANALYSIS_RESULTS</h4>
          </div>
          
          <div className="space-y-2">
            {validationIssues.map((issue, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg font-mono text-sm ${
                  issue.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : issue.type === 'warning'
                    ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                }`}
              >
                <span className="flex-shrink-0 text-lg">
                  {issue.type === 'error' ? '🚨' : issue.type === 'warning' ? '⚠️' : '💡'}
                </span>
                <div>
                  <p className="font-medium">
                    {issue.line ? `[LINE:${issue.line}] ` : ''}
                    {issue.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

TerminalCodeEditor.displayName = 'TerminalCodeEditor'

export default TerminalCodeEditor