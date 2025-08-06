import { useState, useCallback } from 'react'
import { API_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants'

export const useAIReview = () => {
  const [review, setReview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reviewMetadata, setReviewMetadata] = useState(null)

  const generateReview = useCallback(async (codeData) => {
    setIsLoading(true)
    setError(null)
    setReview('')
    setReviewMetadata(null)

    try {
      // Validate input data
      if (!codeData.code || !codeData.code.trim()) {
        throw new Error(ERROR_MESSAGES.EMPTY_CODE)
      }

      // Prepare request payload
      const payload = {
        code: codeData.code,
        fileName: codeData.fileName || 'untitled',
        language: codeData.language || 'text',
        reviewLevel: codeData.reviewLevel || 3,
        focusAreas: codeData.focusAreas || ['logic', 'security', 'readability']
      }

      // Make API request
      const response = await fetch(API_ENDPOINTS.GENERATE_REVIEW, {
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
          throw new Error(ERROR_MESSAGES.RATE_LIMIT)
        } else if (response.status >= 500) {
          throw new Error(ERROR_MESSAGES.API_ERROR)
        } else if (response.status >= 400) {
          throw new Error(errorData.error || ERROR_MESSAGES.API_ERROR)
        } else {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
        }
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || ERROR_MESSAGES.API_ERROR)
      }

      setReview(data.review)
      setReviewMetadata(data.metadata || {})
      
      return {
        success: true,
        review: data.review,
        metadata: data.metadata
      }

    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.API_ERROR
      setError(errorMessage)
      console.error('Review generation error:', err)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearReview = useCallback(() => {
    setReview('')
    setError(null)
    setReviewMetadata(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    review,
    isLoading,
    error,
    reviewMetadata,
    generateReview,
    clearReview,
    clearError
  }
}

export default useAIReview