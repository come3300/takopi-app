import { useState } from 'react'
import FileUploader from '../components/FileUploader'
import CodeEditor from '../components/CodeEditor'
import ReviewDisplay from '../components/ReviewDisplay'
import SettingsPanel from '../components/SettingsPanel'
import LoadingSpinner from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorBoundary'
import useAIReview from '../hooks/useAIReview'
import { useSettings } from '../hooks/useLocalStorage'

const HomePage = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🐙 タコピーAIコードレビューっピ！
        </h1>
        <p className="text-lg text-gray-600">
          ハッピー星から来たタコピーが、あなたのコードを優しくレビューするっピ！
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex space-x-1 mb-4 border-b">
              <button
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'upload'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                📁 ファイルアップロード
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                ✏️ コード入力
              </button>
            </div>

            {activeTab === 'upload' ? (
              <FileUploader
                onFileSelect={(code, name, lang) => {
                  setCurrentCode(code)
                  setFileName(name)
                  setLanguage(lang)
                }}
              />
            ) : (
              <CodeEditor
                code={currentCode}
                fileName={fileName}
                language={language}
                onCodeChange={setCurrentCode}
                onFileNameChange={setFileName}
                onLanguageChange={setLanguage}
              />
            )}
          </div>

          <SettingsPanel />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={handleStartReview}
              disabled={!currentCode.trim() || isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                !currentCode.trim() || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'tacopii-gradient text-white hover:shadow-lg active:scale-95'
              }`}
            >
              {isLoading ? '🐙 レビュー中っピ...' : '🌟 レビュー開始っピ！'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              🌟 タコピーのレビューっピ
            </h2>
            {review && (
              <button
                onClick={clearReview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="レビューをクリア"
              >
                🗑️
              </button>
            )}
          </div>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage 
                error={error} 
                onRetry={handleStartReview}
                onDismiss={clearError}
              />
            </div>
          )}
          
          {isLoading ? (
            <LoadingSpinner message="タコピーがコードを見てるっピ..." />
          ) : review ? (
            <ReviewDisplay review={review} metadata={reviewMetadata} />
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🐙</div>
              <p>コードをアップロードして、「レビュー開始っピ！」ボタンを押してねっピ</p>
              {!currentCode.trim() && (
                <p className="text-sm mt-2 text-amber-600">
                  💡 まずはコードを入力してくださいっピ
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage