import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

const ReviewDisplay = ({ review, metadata = {} }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  if (!review) {
    return (
      <div className="text-center text-gray-500 py-12">
        <div className="text-6xl mb-4">🐙</div>
        <p>まだレビューがないっピ！</p>
        <p className="text-sm mt-2">コードをアップロードして「レビュー開始っピ！」ボタンを押してねっピ</p>
      </div>
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(review)
      // In a real app, you'd show a toast notification here
      alert('レビューをクリップボードにコピーしましたっピ！')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadAsMarkdown = () => {
    const blob = new Blob([review], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tacopii-review-${metadata.fileName || 'code'}-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const customComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      
      if (!inline && match) {
        return (
          <div className="my-4">
            <div className="bg-gray-800 text-gray-200 px-3 py-1 text-xs font-medium rounded-t-lg">
              {match[1]}
            </div>
            <SyntaxHighlighter
              style={isDarkMode ? tomorrow : prism}
              language={match[1]}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: '0 0 0.5rem 0.5rem',
                fontSize: '0.875rem'
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        )
      }
      
      return (
        <code 
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" 
          {...props}
        >
          {children}
        </code>
      )
    },
    
    h1({ children }) {
      return (
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          {children}
        </h1>
      )
    },
    
    h2({ children }) {
      return (
        <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6 flex items-center">
          {children}
        </h2>
      )
    },
    
    h3({ children }) {
      return (
        <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">
          {children}
        </h3>
      )
    },
    
    p({ children }) {
      return <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>
    },
    
    ul({ children }) {
      return <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">{children}</ul>
    },
    
    ol({ children }) {
      return <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">{children}</ol>
    },
    
    li({ children }) {
      return <li className="ml-2">{children}</li>
    },
    
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r-lg mb-4 text-gray-600 italic">
          {children}
        </blockquote>
      )
    },
    
    strong({ children }) {
      return <strong className="font-semibold text-gray-900">{children}</strong>
    },
    
    em({ children }) {
      return <em className="italic text-gray-600">{children}</em>
    },
    
    hr() {
      return <hr className="border-gray-300 my-6" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🐙</span>
          <div>
            <h3 className="font-semibold text-gray-900">タコピーのレビュー結果</h3>
            {metadata.fileName && (
              <p className="text-sm text-gray-500">
                📄 {metadata.fileName} ({metadata.language})
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            title="テーマ切り替え"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            title="クリップボードにコピー"
          >
            📋
          </button>
          
          <button
            onClick={downloadAsMarkdown}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
            title="Markdownファイルとしてダウンロード"
          >
            📥
          </button>
        </div>
      </div>

      {/* Review content */}
      <div className={`prose prose-sm max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
        <div 
          className={`p-6 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-900 border-gray-700 text-white' 
              : 'bg-white border-gray-200'
          }`}
        >
          <ReactMarkdown
            components={customComponents}
            className={isDarkMode ? 'text-white' : 'text-gray-900'}
          >
            {review}
          </ReactMarkdown>
        </div>
      </div>

      {/* Review metadata */}
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">📊 レビュー情報</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {metadata.fileName && (
              <div>
                <span className="text-gray-500">ファイル名:</span>
                <span className="ml-2 font-medium">{metadata.fileName}</span>
              </div>
            )}
            {metadata.language && (
              <div>
                <span className="text-gray-500">言語:</span>
                <span className="ml-2 font-medium">{metadata.language}</span>
              </div>
            )}
            {metadata.reviewLevel && (
              <div>
                <span className="text-gray-500">レビューレベル:</span>
                <span className="ml-2 font-medium">{metadata.reviewLevel}/5</span>
              </div>
            )}
            {metadata.codeLength && (
              <div>
                <span className="text-gray-500">コード長:</span>
                <span className="ml-2 font-medium">{metadata.codeLength}文字</span>
              </div>
            )}
            {metadata.focusAreas && metadata.focusAreas.length > 0 && (
              <div className="col-span-2">
                <span className="text-gray-500">フォーカス:</span>
                <span className="ml-2 font-medium">
                  {metadata.focusAreas.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tacopii encouragement */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🌟</span>
          <div>
            <p className="text-primary font-medium">
              コードレビューありがとうっピ！
            </p>
            <p className="text-sm text-gray-600">
              みんなのコードがもっとハッピーになりますようにっピ！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewDisplay