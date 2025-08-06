import { useState, useCallback } from 'react'
import { API_ENDPOINTS } from '../utils/constants'

export const useConsultation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (message, messageHistory = []) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate input
      if (!message || !message.trim()) {
        throw new Error('メッセージが入力されていませんっピ')
      }

      if (message.length > 2000) {
        throw new Error('メッセージが長すぎますっピ（最大2,000文字）')
      }

      // Prepare request payload
      const payload = {
        message: message.trim(),
        messageHistory: messageHistory
      }

      // Make API request
      const response = await fetch(API_ENDPOINTS.CONSULTATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 429) {
          throw new Error('ちょっと待ってねっピ。1時間後にまた相談に乗るっピ')
        } else if (response.status >= 500) {
          throw new Error('タコピーが少し疲れちゃったっピ。でも大丈夫、すぐに元気になるっピ！')
        } else if (response.status >= 400) {
          throw new Error(errorData.error || 'タコピーがうまく聞き取れなかったっピ')
        } else {
          throw new Error('タコピーとの通信でトラブったっピ')
        }
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'タコピーが少し調子悪いっピ')
      }

      return {
        success: true,
        consolation: data.consolation,
        metadata: data.metadata
      }

    } catch (err) {
      const errorMessage = err.message || 'タコピーが少し疲れちゃったっピ。でも大丈夫、すぐに元気になるっピ！'
      setError(errorMessage)
      console.error('Consultation error:', err)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    sendMessage,
    clearError
  }
}

export default useConsultation