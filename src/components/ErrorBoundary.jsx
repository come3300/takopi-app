import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // In production, you might want to log to an error reporting service
    // logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🐙💔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              あっぴー！エラーが発生したっピ
            </h1>
            <p className="text-gray-600 mb-6">
              申し訳ないっピ！何かの問題で画面が表示できなくなってしまったっピ。
              ページを再読み込みしてみてくださいっピ。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full tacopii-button-primary"
              >
                🔄 ページを再読み込み
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full tacopii-button bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                🔧 再試行
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  開発者向け情報を表示
                </summary>
                <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="mt-1">{this.state.error && this.state.error.toString()}</pre>
                  </div>
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1">{this.state.errorInfo.componentStack}</pre>
                  </div>
                </div>
              </details>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <p>問題が続く場合は、</p>
              <a 
                href="#contact" 
                className="text-primary hover:text-primary-light underline"
              >
                お問い合わせ
              </a>
              <span> からご連絡くださいっピ</span>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Error display component for non-critical errors
export const ErrorMessage = ({ 
  error, 
  onRetry, 
  onDismiss,
  title = 'エラーが発生しましたっピ',
  showRetry = true,
  showDismiss = true 
}) => {
  if (!error) return null

  return (
    <div className="bg-error/10 border border-error/20 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <span className="text-2xl flex-shrink-0">❌</span>
        <div className="flex-grow">
          <h3 className="font-medium text-error mb-1">{title}</h3>
          <p className="text-sm text-error/80 mb-3">
            {typeof error === 'string' ? error : error.message || '予期しないエラーが発生しました'}
          </p>
          
          <div className="flex space-x-2">
            {showRetry && onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-error text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                🔄 再試行
              </button>
            )}
            
            {showDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
              >
                ✖️ 閉じる
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Network error specific component
export const NetworkError = ({ onRetry }) => {
  return (
    <ErrorMessage
      error="ネットワークに接続できませんっピ。インターネット接続を確認してくださいっピ。"
      title="接続エラーっピ"
      onRetry={onRetry}
    />
  )
}

// API error specific component
export const APIError = ({ error, onRetry }) => {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error
    
    if (error?.status === 429) {
      return 'レート制限に達しましたっピ。しばらく待ってから再試行してくださいっピ。'
    }
    
    if (error?.status === 500) {
      return 'サーバーに問題が発生していますっピ。しばらく待ってから再試行してくださいっピ。'
    }
    
    return error?.message || 'APIエラーが発生しましたっピ'
  }

  return (
    <ErrorMessage
      error={getErrorMessage(error)}
      title="API エラーっピ"
      onRetry={onRetry}
    />
  )
}

// File error specific component
export const FileError = ({ error, onRetry, onDismiss }) => {
  return (
    <ErrorMessage
      error={error}
      title="ファイルエラーっピ"
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  )
}

export default ErrorBoundary