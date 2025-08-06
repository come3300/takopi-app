import { useState, useEffect, useCallback } from 'react'
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants'

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue)
      if (newValue === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key])

  return [value, setStoredValue]
}

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setSettings])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }))
  }, [setSettings])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [setSettings])

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings
  }
}

export const useRecentFiles = (maxFiles = 10) => {
  const [recentFiles, setRecentFiles] = useLocalStorage(LOCAL_STORAGE_KEYS.RECENT_FILES, [])

  const addRecentFile = useCallback((file) => {
    setRecentFiles(prev => {
      const existingIndex = prev.findIndex(f => f.name === file.name)
      let newFiles = [...prev]

      if (existingIndex >= 0) {
        newFiles.splice(existingIndex, 1)
      }

      newFiles.unshift({
        ...file,
        accessedAt: new Date().toISOString()
      })

      return newFiles.slice(0, maxFiles)
    })
  }, [setRecentFiles, maxFiles])

  const removeRecentFile = useCallback((fileName) => {
    setRecentFiles(prev => prev.filter(f => f.name !== fileName))
  }, [setRecentFiles])

  const clearRecentFiles = useCallback(() => {
    setRecentFiles([])
  }, [setRecentFiles])

  return {
    recentFiles,
    addRecentFile,
    removeRecentFile,
    clearRecentFiles
  }
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_PREFERENCES, {
    theme: 'light',
    language: 'ja',
    showWelcomeMessage: true,
    enableNotifications: true,
    autoSaveInterval: 30000 // 30 seconds
  })

  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }, [setPreferences])

  const resetPreferences = useCallback(() => {
    setPreferences({
      theme: 'light',
      language: 'ja',
      showWelcomeMessage: true,
      enableNotifications: true,
      autoSaveInterval: 30000
    })
  }, [setPreferences])

  return {
    preferences,
    updatePreference,
    resetPreferences
  }
}

// Hook for managing review history
export const useReviewHistory = (maxHistory = 50) => {
  const [reviewHistory, setReviewHistory] = useLocalStorage('tacopii_review_history', [])

  const addToHistory = useCallback((reviewData) => {
    setReviewHistory(prev => {
      const newHistory = [{
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...reviewData
      }, ...prev]

      return newHistory.slice(0, maxHistory)
    })
  }, [setReviewHistory, maxHistory])

  const removeFromHistory = useCallback((id) => {
    setReviewHistory(prev => prev.filter(item => item.id !== id))
  }, [setReviewHistory])

  const clearHistory = useCallback(() => {
    setReviewHistory([])
  }, [setReviewHistory])

  const getHistoryItem = useCallback((id) => {
    return reviewHistory.find(item => item.id === id)
  }, [reviewHistory])

  return {
    reviewHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryItem
  }
}

export default useLocalStorage