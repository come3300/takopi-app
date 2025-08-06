import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { detectLanguage } from '../utils/languageDetector'
import { parseFile } from '../utils/fileParser'

const FileUploader = ({ onFileSelect }) => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('')
    
    if (rejectedFiles.length > 0) {
      const rejectedReasons = rejectedFiles.map(file => 
        file.errors.map(error => error.message).join(', ')
      ).join('; ')
      setError(`ファイルが無効っピ: ${rejectedReasons}`)
      return
    }

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
            size: file.size
          }

          setUploadedFiles(prev => [...prev, newFile])
          
          if (onFileSelect) {
            onFileSelect(parsedContent, file.name, language)
          }
        } catch (error) {
          setError(`ファイルの読み込みに失敗したっピ: ${error.message}`)
        }
      }
      reader.onerror = () => {
        setError('ファイルの読み込みに失敗したっピ')
      }
      reader.readAsText(file)
    })
  }, [onFileSelect])

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const getFileIcon = (language) => {
    const icons = {
      javascript: '📄',
      typescript: '📘',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
      go: '🚀',
      rust: '🦀',
      php: '🐘',
      ruby: '💎',
      swift: '🍎',
      kotlin: '🤖',
      dart: '🎯',
      html: '🌐',
      css: '🎨',
      json: '📋',
      xml: '📄',
      yaml: '⚙️',
      default: '📄'
    }
    return icons[language] || icons.default
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive && !isDragReject ? 'border-primary bg-primary/5' : ''}
          ${isDragReject ? 'border-error bg-error/5' : ''}
          ${!isDragActive ? 'border-gray-300 hover:border-primary hover:bg-gray-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl">
            {isDragActive ? (isDragReject ? '❌' : '📁') : '🐙'}
          </div>
          <div>
            {isDragActive ? (
              isDragReject ? (
                <p className="text-error font-medium">
                  このファイル形式はサポートしてないっピ...
                </p>
              ) : (
                <p className="text-primary font-medium">
                  ファイルをここにドロップするっピ！
                </p>
              )
            ) : (
              <div>
                <p className="text-gray-700 font-medium mb-2">
                  コードファイルをドラッグ&ドロップするか、クリックして選択するっピ！
                </p>
                <p className="text-sm text-gray-500">
                  対応形式: JS, TS, Python, Java, C++, Go, Rust など
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  最大5MB、複数ファイル対応っピ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">アップロードされたファイル:</h3>
          <div className="space-y-2">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getFileIcon(file.language)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {file.language} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-error transition-colors p-1"
                  title="ファイルを削除"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader