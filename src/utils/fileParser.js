export const parseFile = (content, fileName, language) => {
  try {
    // Remove BOM if present
    const cleanContent = content.replace(/^\uFEFF/, '')
    
    // Handle different file types
    switch (language) {
      case 'json':
        // Validate JSON syntax
        try {
          JSON.parse(cleanContent)
        } catch (e) {
          throw new Error(`JSONファイルの構文エラーっピ: ${e.message}`)
        }
        break
        
      case 'xml':
        // Basic XML validation
        if (!cleanContent.trim().startsWith('<')) {
          throw new Error('XMLファイルの形式が正しくないっピ')
        }
        break
        
      case 'yaml':
      case 'yml':
        // Basic YAML validation
        if (cleanContent.includes('\t')) {
          console.warn('YAMLファイルにタブ文字が含まれているっピ。スペースを使用することを推奨するっピ。')
        }
        break
        
      default:
        // For code files, ensure they're not empty
        if (!cleanContent.trim()) {
          throw new Error('ファイルが空っピ')
        }
    }
    
    return cleanContent
  } catch (error) {
    throw new Error(`ファイル解析エラー: ${error.message}`)
  }
}

export const analyzeCodeStructure = (content, language) => {
  const analysis = {
    lines: content.split('\n').length,
    characters: content.length,
    isEmpty: !content.trim(),
    language: language
  }
  
  // Language-specific analysis
  switch (language) {
    case 'javascript':
    case 'typescript':
      analysis.functions = (content.match(/function\s+\w+|=>\s*{|const\s+\w+\s*=/g) || []).length
      analysis.classes = (content.match(/class\s+\w+/g) || []).length
      analysis.imports = (content.match(/import\s+.*from|require\(/g) || []).length
      break
      
    case 'python':
      analysis.functions = (content.match(/def\s+\w+/g) || []).length
      analysis.classes = (content.match(/class\s+\w+/g) || []).length
      analysis.imports = (content.match(/^(import|from)\s+/gm) || []).length
      break
      
    case 'java':
      analysis.classes = (content.match(/class\s+\w+/g) || []).length
      analysis.methods = (content.match(/(public|private|protected).*\s+\w+\s*\(/g) || []).length
      analysis.imports = (content.match(/import\s+/g) || []).length
      break
      
    case 'cpp':
    case 'c':
      analysis.functions = (content.match(/\w+\s+\w+\s*\([^)]*\)\s*{/g) || []).length
      analysis.includes = (content.match(/#include\s*<.*>|#include\s*".*"/g) || []).length
      break
      
    default:
      // Generic analysis for other languages
      analysis.functions = (content.match(/\w+\s*\([^)]*\)\s*{/g) || []).length
  }
  
  return analysis
}

export const validateCode = (content, language) => {
  const issues = []
  
  // General validations
  if (!content.trim()) {
    issues.push({ type: 'error', message: 'ファイルが空っピ' })
    return issues
  }
  
  // Check for very long lines
  const lines = content.split('\n')
  lines.forEach((line, index) => {
    if (line.length > 120) {
      issues.push({
        type: 'warning',
        line: index + 1,
        message: `行が長すぎるっピ (${line.length}文字)`
      })
    }
  })
  
  // Language-specific validations
  switch (language) {
    case 'javascript':
    case 'typescript':
      // Check for common issues
      if (content.includes('var ')) {
        issues.push({
          type: 'suggestion',
          message: 'varの代わりにletまたはconstを使うことを推奨するっピ'
        })
      }
      if (!content.includes('use strict') && !content.includes('"use strict"')) {
        issues.push({
          type: 'suggestion',
          message: 'strict modeの使用を検討してねっピ'
        })
      }
      break
      
    case 'python':
      // Check Python-specific issues
      if (content.includes('\t') && content.includes('    ')) {
        issues.push({
          type: 'warning',
          message: 'タブとスペースが混在しているっピ。統一することを推奨するっピ'
        })
      }
      break
      
    case 'json':
      try {
        JSON.parse(content)
      } catch (e) {
        issues.push({
          type: 'error',
          message: `JSON構文エラー: ${e.message}`
        })
      }
      break
  }
  
  return issues
}