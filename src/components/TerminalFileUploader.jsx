import { useCallback, useState, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { detectLanguage } from '../utils/languageDetector'
import { parseFile } from '../utils/fileParser'

const TerminalFileUploader = memo(({ onFileSelect }) => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('')
    
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(file => 
        file.errors.map(error => error.message).join(', ')
      ).join('; ')
      setError(`[ERROR] File validation failed: ${rejectedReasons}`)
      return
    }

    setIsProcessing(true)

    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target.result
          const language = detectLanguage(file.name)
          const parsedContent = parseFile(content, file.name, language)
          
          const newFile = {
            id: Date.now() + Math.random(),
            name: file.name,
            content: parsedContent,
            language: language,
            size: file.size,
            timestamp: new Date().toISOString()
          }

          setUploadedFiles(prev => [...prev, newFile])
          
          if (onFileSelect) {
            onFileSelect(parsedContent, file.name, language)
          }
          
          setIsProcessing(false)
        } catch (error) {
          setError(`[ERROR] File parsing failed: ${error.message}`)
          setIsProcessing(false)
        }
      }
      reader.onerror = () => {
        setError('[ERROR] File reading failed - corrupted file detected')
        setIsProcessing(false)
      }
      reader.readAsText(file)
    })
  }, [onFileSelect])

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const getFileIcon = (language) => {
    const icons = {
      javascript: '📄', typescript: '📘', python: '🐍', java: '☕',
      cpp: '⚡', c: '🔧', go: '🚀', rust: '🦀', php: '🐘', ruby: '💎',
      swift: '🍎', kotlin: '🤖', dart: '🎯', html: '🌐', css: '🎨',
      json: '📋', xml: '📄', yaml: '⚙️', default: '📄'
    }
    return icons[language] || icons.default
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs', '.kt', '.swift', '.dart', '.vue', '.html', '.css', '.scss', '.json', '.xml', '.yaml', '.yml', '.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  })

  return (
    <div className="space-y-4">
      {/* ターミナルスタイルのファイルアップローダー */}
      <div 
        className={`rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 ${
          isDragActive ? 'scale-[1.02]' : 'scale-100'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
          border: `2px solid ${
            isDragReject ? 'rgba(239, 68, 68, 0.5)' : 
            isDragActive ? 'rgba(34, 197, 94, 0.5)' : 
            'rgba(75, 85, 99, 0.3)'
          }`,
        }}
      >
        {/* ターミナルヘッダー */}
        <div 
          className="px-4 py-3 border-b"
          style={{
            background: `linear-gradient(135deg, 
              ${isDragReject ? 'rgba(239, 68, 68, 0.1)' : 
                isDragActive ? 'rgba(34, 197, 94, 0.1)' : 
                'rgba(79, 172, 254, 0.1)'} 0%, 
              rgba(100, 181, 246, 0.05) 100%
            )`,
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
                <span>🐙 Tacopii File Transfer Terminal</span>
                {isProcessing && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            
            <div className="text-gray-400 text-xs font-mono bg-gray-700/50 px-2 py-1 rounded">
              SECURE
            </div>
          </div>
        </div>

        {/* ドロップゾーン */}
        <div 
          {...getRootProps()}
          className="p-8 cursor-pointer font-mono"
          style={{ background: 'rgba(13, 17, 23, 0.98)' }}
        >
          <input {...getInputProps()} />
          
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">
              {isDragActive ? (isDragReject ? '🚫' : '📥') : '🐙'}
            </div>
            
            <div className="space-y-2">
              {isDragActive ? (
                isDragReject ? (
                  <div>
                    <p className="text-red-400 font-bold text-lg">
                      [ACCESS_DENIED] Unsupported file format
                    </p>
                    <p className="text-red-300 text-sm">
                      Please upload supported code files only っピ
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-green-400 font-bold text-lg">
                      [UPLOAD_READY] Drop files here
                    </p>
                    <p className="text-green-300 text-sm">
                      Processing will start immediately っピ
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <p className="text-cyan-400 font-bold text-lg mb-2">
                    $ ./upload_files.sh --interactive
                  </p>
                  <div className="text-left bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                    <p className="text-green-400 mb-2">
                      <span className="text-yellow-400">tacopii@fileserver:</span>
                      <span className="text-blue-400">~/upload</span>
                      <span className="text-green-400">$</span> echo "Drag & drop or click to select code files"
                    </p>
                    <p className="text-white mb-2">Drag & drop or click to select code files</p>
                    <p className="text-gray-400 text-sm">
                      <span className="text-cyan-400">[SUPPORTED]:</span> JS, TS, Python, Java, C++, Go, Rust, PHP, Ruby...
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="text-yellow-400">[LIMITS]:</span> Max 5MB per file • Multiple files OK
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="text-pink-400">[STATUS]:</span> Ready for upload っピ ✨
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div 
          className="rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          <div className="font-mono">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🚨</span>
              <span className="text-red-400 font-bold">SYSTEM_ERROR</span>
            </div>
            <div className="bg-red-900/20 p-3 rounded border-l-4 border-red-500">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* アップロードされたファイル一覧 */}
      {uploadedFiles.length > 0 && (
        <div 
          className="rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.98) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <div className="font-mono">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📁</span>
              <span className="text-green-400 font-bold">UPLOADED_FILES</span>
              <span className="text-gray-400">({uploadedFiles.length})</span>
            </div>
            
            <div className="space-y-2">
              {uploadedFiles.map(file => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getFileIcon(file.language)}</span>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <div className="text-xs text-gray-400 flex items-center space-x-3">
                        <span className="text-cyan-400">LANG:</span><span>{file.language.toUpperCase()}</span>
                        <span className="text-yellow-400">SIZE:</span><span>{formatFileSize(file.size)}</span>
                        <span className="text-green-400">STATUS:</span><span>READY</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-900/20 font-mono text-xs"
                    title="Remove file"
                  >
                    [DEL]
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>
                  <span className="text-green-400">[TOTAL]:</span> {uploadedFiles.length} files uploaded
                </span>
                <span>
                  <span className="text-blue-400">[MODE]:</span> Interactive terminal upload
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

TerminalFileUploader.displayName = 'TerminalFileUploader'

export default TerminalFileUploader