import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="text-3xl">🐙</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                タコピーAIコードレビュー
              </h1>
              <p className="text-xs text-gray-500">
                ハッピー星から愛をお届けっピ
              </p>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary font-medium' : ''
              }`}
            >
              🌟 コードレビュー
            </Link>
            <Link 
              to="/consultation" 
              className={`text-gray-600 hover:text-secondary transition-colors ${
                location.pathname === '/consultation' ? 'text-secondary font-medium' : ''
              }`}
            >
              💖 相談室
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {location.pathname === '/' ? (
              <Link 
                to="/consultation"
                className="px-3 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-pink-500 transition-colors"
              >
                💖 癒しが欲しい時は
              </Link>
            ) : (
              <Link 
                to="/"
                className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                🌟 コードレビューへ
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`flex-1 text-center py-2 text-sm rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌟 コードレビュー
            </Link>
            <Link 
              to="/consultation" 
              className={`flex-1 text-center py-2 text-sm rounded-lg transition-colors ${
                location.pathname === '/consultation' 
                  ? 'bg-secondary text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              💖 相談室
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header