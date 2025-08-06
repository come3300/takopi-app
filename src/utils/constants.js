export const REVIEW_LEVELS = [
  { value: 1, label: '軽め', description: '大きな問題のみチェック' },
  { value: 2, label: '基本', description: '基本的な問題を指摘' },
  { value: 3, label: '標準', description: '標準的なコードレビュー' },
  { value: 4, label: '詳細', description: '詳細な分析と最適化提案' },
  { value: 5, label: '徹底', description: 'あらゆる観点から徹底分析' }
]

export const FOCUS_AREAS = [
  { id: 'logic', label: 'ロジック', description: 'アルゴリズムと正確性', icon: '🧠' },
  { id: 'security', label: 'セキュリティ', description: '脆弱性と安全性', icon: '🔒' },
  { id: 'performance', label: 'パフォーマンス', description: '速度とメモリ効率', icon: '⚡' },
  { id: 'readability', label: '可読性', description: 'コードの理解しやすさ', icon: '👁️' },
  { id: 'maintainability', label: '保守性', description: '変更とメンテナンスの容易さ', icon: '🔧' },
  { id: 'testing', label: 'テスト', description: 'テスタビリティとカバレッジ', icon: '🧪' },
  { id: 'documentation', label: 'ドキュメント', description: 'コメントとドキュメンテーション', icon: '📚' },
  { id: 'architecture', label: 'アーキテクチャ', description: '設計パターンと構造', icon: '🏗️' },
  { id: 'bestpractices', label: 'ベストプラクティス', description: '業界標準と推奨事項', icon: '⭐' }
]

export const SUPPORTED_FILE_TYPES = {
  'text/javascript': ['.js', '.jsx', '.mjs', '.cjs'],
  'text/typescript': ['.ts', '.tsx'],
  'text/python': ['.py', '.pyw'],
  'text/java': ['.java'],
  'text/cpp': ['.cpp', '.cxx', '.cc', '.c++', '.h', '.hpp'],
  'text/c': ['.c', '.h'],
  'text/csharp': ['.cs'],
  'text/go': ['.go'],
  'text/rust': ['.rs'],
  'text/php': ['.php', '.php3', '.php4', '.php5'],
  'text/ruby': ['.rb', '.rbw'],
  'text/swift': ['.swift'],
  'text/kotlin': ['.kt', '.kts'],
  'text/dart': ['.dart'],
  'text/html': ['.html', '.htm'],
  'text/css': ['.css', '.scss', '.sass', '.less'],
  'text/vue': ['.vue'],
  'application/json': ['.json'],
  'text/xml': ['.xml'],
  'text/yaml': ['.yaml', '.yml'],
  'text/plain': ['.txt', '.md']
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const API_ENDPOINTS = {
  GENERATE_REVIEW: '/api/generate-review',
  HEALTH_CHECK: '/api/health-check',
  CONSULTATION: '/api/consultation'
}

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'ファイルサイズが大きすぎますっピ（最大5MB）',
  UNSUPPORTED_FILE: 'サポートされていないファイル形式ですっピ',
  EMPTY_CODE: 'コードが入力されていませんっピ',
  API_ERROR: 'レビュー生成中にエラーが発生しましたっピ',
  NETWORK_ERROR: 'ネットワークエラーが発生しましたっピ',
  RATE_LIMIT: 'レート制限に達しましたっピ。しばらく待ってから再試行してくださいっピ'
}

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'ファイルがアップロードされましたっピ！',
  REVIEW_GENERATED: 'レビューが完了しましたっピ！',
  SETTINGS_SAVED: '設定が保存されましたっピ！'
}

export const TACOPII_PHRASES = [
  'みんながハッピーになりますようにっピ！',
  'コードを見るのが楽しいっピ！',
  '一緒に素晴らしいコードを作りましょうっピ！',
  'プログラミングは楽しいっピ！',
  'ハッピー星から愛をお届けっピ！',
  'みんなの成長が嬉しいっピ！'
]

export const LOADING_MESSAGES = [
  'タコピーがコードを読んでいますっピ...',
  'ハッピー星の知恵で分析中っピ...',
  '優しいレビューを準備中っピ...',
  'コードの美しさをチェック中っピ...',
  'みんながハッピーになるアドバイスを考え中っピ...'
]

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'tacopii_settings',
  RECENT_FILES: 'tacopii_recent_files',
  USER_PREFERENCES: 'tacopii_user_preferences'
}

export const DEFAULT_SETTINGS = {
  reviewLevel: 3,
  focusAreas: ['logic', 'security', 'readability'],
  theme: 'light',
  autoSave: true,
  showLineNumbers: true,
  enableRealTimeValidation: true
}