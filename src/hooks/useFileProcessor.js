import { useState, useCallback } from 'react'
import { detectLanguage } from '../utils/languageDetector'
import { parseFile, analyzeCodeStructure, validateCode } from '../utils/fileParser'
import { MAX_FILE_SIZE, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

export const useFileProcessor = () => {
  const [processedFiles, setProcessedFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const processFile = useCallback(async (file) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE)
      }

      // Read file content
      const content = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しましたっピ'))
        reader.readAsText(file)
      })

      // Detect language and parse content
      const language = detectLanguage(file.name)
      const parsedContent = parseFile(content, file.name, language)
      
      // Analyze code structure
      const analysis = analyzeCodeStructure(parsedContent, language)
      const validation = validateCode(parsedContent, language)

      // Create processed file object
      const processedFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        originalName: file.name,
        content: parsedContent,
        language: language,
        size: file.size,
        lastModified: file.lastModified,
        analysis: analysis,
        validation: validation,
        processedAt: new Date().toISOString()
      }

      setProcessedFiles(prev => [...prev, processedFile])
      
      return {
        success: true,
        file: processedFile,
        message: SUCCESS_MESSAGES.FILE_UPLOADED
      }

    } catch (err) {
      const errorMessage = err.message || 'ファイル処理中にエラーが発生しましたっピ'
      setError(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const processMultipleFiles = useCallback(async (files) => {
    const results = []
    setIsProcessing(true)
    setError(null)

    try {
      for (const file of files) {
        const result = await processFile(file)
        results.push(result)
      }

      const failedFiles = results.filter(r => !r.success)
      if (failedFiles.length > 0) {
        const errorMessages = failedFiles.map(f => f.error).join(', ')
        setError(`一部のファイル処理に失敗しましたっピ: ${errorMessages}`)
      }

      return {
        success: failedFiles.length === 0,
        results: results,
        successCount: results.filter(r => r.success).length,
        failCount: failedFiles.length
      }

    } catch (err) {
      const errorMessage = 'ファイル処理中にエラーが発生しましたっピ'
      setError(errorMessage)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }, [processFile])

  const removeFile = useCallback((fileId) => {
    setProcessedFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const clearFiles = useCallback(() => {
    setProcessedFiles([])
    setError(null)
  }, [])

  const getFileById = useCallback((fileId) => {
    return processedFiles.find(file => file.id === fileId)
  }, [processedFiles])

  const updateFile = useCallback((fileId, updates) => {
    setProcessedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, ...updates, lastModified: Date.now() }
          : file
      )
    )
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    processedFiles,
    isProcessing,
    error,
    processFile,
    processMultipleFiles,
    removeFile,
    clearFiles,
    getFileById,
    updateFile,
    clearError
  }
}

export default useFileProcessor