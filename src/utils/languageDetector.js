export const detectLanguage = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase()
  
  const languageMap = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'mjs': 'javascript',
    'cjs': 'javascript',
    
    // Python
    'py': 'python',
    'pyw': 'python',
    'pyc': 'python',
    
    // Java/JVM languages
    'java': 'java',
    'kt': 'kotlin',
    'kts': 'kotlin',
    'scala': 'scala',
    
    // C/C++
    'c': 'c',
    'cpp': 'cpp',
    'cxx': 'cpp',
    'cc': 'cpp',
    'c++': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'hxx': 'cpp',
    
    // C#
    'cs': 'csharp',
    
    // Go
    'go': 'go',
    
    // Rust
    'rs': 'rust',
    
    // PHP
    'php': 'php',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phtml': 'php',
    
    // Ruby
    'rb': 'ruby',
    'rbw': 'ruby',
    
    // Swift
    'swift': 'swift',
    
    // Dart
    'dart': 'dart',
    
    // Web technologies
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',
    'vue': 'vue',
    
    // Shell/Bash
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'fish': 'bash',
    
    // Data formats
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',
    
    // Database
    'sql': 'sql',
    
    // Other
    'txt': 'text',
    'md': 'markdown',
    'dockerfile': 'dockerfile'
  }
  
  return languageMap[extension] || 'text'
}

export const getSyntaxHighlightLanguage = (language) => {
  const syntaxMap = {
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'kotlin': 'kotlin',
    'scala': 'scala',
    'c': 'c',
    'cpp': 'cpp',
    'csharp': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'dart': 'dart',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'vue': 'vue',
    'bash': 'bash',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'toml': 'toml',
    'ini': 'ini',
    'sql': 'sql',
    'markdown': 'markdown',
    'dockerfile': 'dockerfile',
    'text': 'text'
  }
  
  return syntaxMap[language] || 'text'
}

export const getLanguageDisplayName = (language) => {
  const displayNames = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'kotlin': 'Kotlin',
    'scala': 'Scala',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'php': 'PHP',
    'ruby': 'Ruby',
    'swift': 'Swift',
    'dart': 'Dart',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'vue': 'Vue.js',
    'bash': 'Bash',
    'json': 'JSON',
    'xml': 'XML',
    'yaml': 'YAML',
    'toml': 'TOML',
    'ini': 'INI',
    'sql': 'SQL',
    'markdown': 'Markdown',
    'dockerfile': 'Dockerfile',
    'text': 'Text'
  }
  
  return displayNames[language] || language.toUpperCase()
}