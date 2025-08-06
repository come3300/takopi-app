import { useState, useEffect } from 'react'
import { LOADING_MESSAGES } from '../utils/constants'

const LoadingSpinner = ({ message, showRandomMessages = true }) => {
  const [currentMessage, setCurrentMessage] = useState(message || LOADING_MESSAGES[0])

  useEffect(() => {
    if (!showRandomMessages || message) return

    const messageInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length)
      setCurrentMessage(LOADING_MESSAGES[randomIndex])
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [showRandomMessages, message])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Tacopii Loading Animation */}
      <div className="relative mb-6">
        <div className="animate-bounce">
          <span className="text-6xl">🐙</span>
        </div>
        <div className="absolute -top-2 -right-2">
          <div className="animate-spin text-2xl">⭐</div>
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 mb-2 animate-pulse">
          {currentMessage}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 max-w-md text-center">
        <p className="text-sm text-gray-500">
          💡 ヒント: タコピーは優しさをこめてレビューを書いていますっピ
        </p>
      </div>
    </div>
  )
}

// Simplified loading spinner for smaller areas
export const MiniLoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-primary/20 rounded-full`}>
        <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`}></div>
      </div>
    </div>
  )
}

// Loading overlay for full screen
export const LoadingOverlay = ({ message, isVisible = false }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <LoadingSpinner message={message} />
      </div>
    </div>
  )
}

// Skeleton loading for content
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner