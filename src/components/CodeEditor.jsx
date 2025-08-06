import { useState, useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { detectLanguage, getSyntaxHighlightLanguage, getLanguageDisplayName } from '../utils/languageDetector'
import { analyzeCodeStructure, validateCode } from '../utils/fileParser'

const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'kotlin', 'c', 'cpp', 
  'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'dart', 'html', 
  'css', 'scss', 'json', 'xml', 'yaml', 'sql', 'bash', 'markdown'
]

const CodeEditor = ({ 
  code, 
  fileName, 
  language, 
  onCodeChange, 
  onFileNameChange, 
  onLanguageChange 
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [codeStats, setCodeStats] = useState(null)
  const [validationIssues, setValidationIssues] = useState([])
  const textareaRef = useRef(null)

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
    
    // Auto-detect language based on file extension
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
      
      // Restore cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  const formatCode = () => {
    // Simple code formatting for demonstration
    // In a real app, you'd use language-specific formatters
    let formatted = code
    
    switch (language) {
      case 'javascript':
      case 'typescript':
        // Basic JS/TS formatting
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
            ファイル名
          </label>
          <input
            id="fileName"
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="例: app.js, main.py, index.html"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            プログラミング言語
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {getLanguageDisplayName(lang)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              showPreview 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showPreview ? '📝 編集モード' : '👁️ プレビュー'}
          </button>
          
          <button
            onClick={formatCode}
            disabled={!code}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ✨ フォーマット
          </button>
        </div>

        {codeStats && (
          <div className="text-sm text-gray-500">
            {codeStats.lines}行 • {codeStats.characters}文字
            {codeStats.functions > 0 && ` • ${codeStats.functions}関数`}
            {codeStats.classes > 0 && ` • ${codeStats.classes}クラス`}
          </div>
        )}
      </div>

      <div className="relative">
        {showPreview ? (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 text-white text-sm flex items-center justify-between">
              <span>📄 {fileName || 'untitled'}</span>
              <span className="text-gray-300">{getLanguageDisplayName(language)}</span>
            </div>
            <div className="max-h-96 overflow-auto">
              <SyntaxHighlighter
                language={getSyntaxHighlightLanguage(language)}
                style={tomorrow}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                {code || '// コードを入力してくださいっピ'}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={insertTab}
              placeholder="ここにコードを入力してくださいっピ！&#10;&#10;例：&#10;function hello() {&#10;  return 'Hello, Tacopii!'&#10;}"
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute top-2 right-2 bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
              Tabキーでインデント
            </div>
          </div>
        )}
      </div>

      {validationIssues.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">コード分析結果:</h4>
          <div className="space-y-2">
            {validationIssues.map((issue, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 p-3 rounded-lg ${
                  issue.type === 'error'
                    ? 'bg-error/10 border border-error/20 text-error'
                    : issue.type === 'warning'
                    ? 'bg-warning/10 border border-warning/20 text-warning'
                    : 'bg-primary/10 border border-primary/20 text-primary'
                }`}
              >
                <span className="flex-shrink-0">
                  {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : '💡'}
                </span>
                <div>
                  <p className="font-medium">
                    {issue.line ? `Line ${issue.line}: ` : ''}{issue.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeEditor