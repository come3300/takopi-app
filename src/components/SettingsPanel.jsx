import { useState, useEffect } from 'react'
import { useSettings } from '../hooks/useLocalStorage'
import { REVIEW_LEVELS, FOCUS_AREAS } from '../utils/constants'

const SettingsPanel = ({ onSettingsChange }) => {
  const { settings, updateSetting, updateSettings, resetSettings } = useSettings()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(settings)
    }
  }, [settings, onSettingsChange])

  const handleReviewLevelChange = (level) => {
    updateSetting('reviewLevel', level)
  }

  const handleFocusAreaToggle = (areaId) => {
    const currentAreas = settings.focusAreas || []
    const newAreas = currentAreas.includes(areaId)
      ? currentAreas.filter(id => id !== areaId)
      : [...currentAreas, areaId]
    
    updateSetting('focusAreas', newAreas)
  }

  const handleSelectAllFocusAreas = () => {
    const allAreas = FOCUS_AREAS.map(area => area.id)
    updateSetting('focusAreas', allAreas)
  }

  const handleClearAllFocusAreas = () => {
    updateSetting('focusAreas', [])
  }

  const getReviewLevelDescription = (level) => {
    const levelInfo = REVIEW_LEVELS.find(l => l.value === level)
    return levelInfo ? levelInfo.description : ''
  }

  return (
    <div className="premium-glass rounded-3xl transition-all duration-500 hover:scale-[1.01]">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <h3 className="font-semibold text-white">レビュー設定っピ</h3>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          {isExpanded ? '📁' : '📂'}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* Review Level */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-3">
              📈 レビューレベル: {settings.reviewLevel}/5
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={settings.reviewLevel}
                onChange={(e) => handleReviewLevelChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${(settings.reviewLevel - 1) * 25}%, #E5E7EB ${(settings.reviewLevel - 1) * 25}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>軽め</span>
                <span>詳細</span>
              </div>
            </div>
            <p className="text-sm text-white/80 mt-2">
              {getReviewLevelDescription(settings.reviewLevel)}
            </p>
          </div>

          {/* Focus Areas */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-white/90">
                🎯 フォーカス領域
              </label>
              <div className="space-x-2">
                <button
                  onClick={handleSelectAllFocusAreas}
                  className="text-xs text-primary hover:text-primary-light transition-colors"
                >
                  全選択
                </button>
                <button
                  onClick={handleClearAllFocusAreas}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  全解除
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {FOCUS_AREAS.map(area => (
                <label
                  key={area.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    settings.focusAreas?.includes(area.id)
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={settings.focusAreas?.includes(area.id) || false}
                    onChange={() => handleFocusAreaToggle(area.id)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{area.icon}</span>
                  <span className="text-sm font-medium">{area.label}</span>
                </label>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              選択した領域を重点的にレビューしますっピ
            </p>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>{showAdvanced ? '🔽' : '▶️'}</span>
              <span>高度な設定</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                {/* Auto Save */}
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.autoSave || false}
                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">自動保存</span>
                    <p className="text-xs text-gray-500">
                      設定を自動的に保存しますっピ
                    </p>
                  </div>
                </label>

                {/* Show Line Numbers */}
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers !== false}
                    onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">行番号表示</span>
                    <p className="text-xs text-gray-500">
                      コードエディタで行番号を表示しますっピ
                    </p>
                  </div>
                </label>

                {/* Real-time Validation */}
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.enableRealTimeValidation !== false}
                    onChange={(e) => updateSetting('enableRealTimeValidation', e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">リアルタイム検証</span>
                    <p className="text-xs text-gray-500">
                      入力中にコードを検証しますっピ
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Reset Settings */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (window.confirm('設定をリセットしますかっピ？')) {
                  resetSettings()
                }
              }}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🔄 設定をリセット
            </button>
          </div>

          {/* Settings Summary */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">📋 現在の設定</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p>レビューレベル: {settings.reviewLevel}/5</p>
              <p>
                フォーカス領域: {
                  settings.focusAreas?.length > 0 
                    ? `${settings.focusAreas.length}個選択` 
                    : 'なし'
                }
              </p>
              <p>
                オプション: 
                {settings.autoSave ? ' 自動保存' : ''}
                {settings.showLineNumbers ? ' 行番号' : ''}
                {settings.enableRealTimeValidation ? ' リアルタイム検証' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPanel