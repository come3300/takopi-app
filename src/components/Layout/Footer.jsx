const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🐙</span>
              <h3 className="font-semibold text-gray-900">タコピーAIレビュー</h3>
            </div>
            <p className="text-sm text-gray-600">
              ハッピー星から来たタコピーが、みんなのコードをハッピーにするっピ！
              優しくて建設的なフィードバックでプログラミングを楽しくするっピ。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">対応言語</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• JavaScript/TypeScript</div>
              <div>• Python</div>
              <div>• Java</div>
              <div>• C++/C</div>
              <div>• Go</div>
              <div>• Rust</div>
              <div>• PHP</div>
              <div>• その他多数っピ</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">タコピーのサービス</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="text-gray-600 hover:text-primary transition-colors block">
                🌟 コードレビュー
              </a>
              <a href="/consultation" className="text-gray-600 hover:text-secondary transition-colors block">
                💖 癒し相談室
              </a>
              <a href="#github" className="text-gray-600 hover:text-primary transition-colors block">
                GitHub
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors block">
                お問い合わせ
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} タコピーAIコードレビュー. Made with 💖 by Tacopii from Happy Star.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-500">Powered by</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-primary text-white px-2 py-1 rounded">Gemini AI</span>
                <span className="text-xs bg-secondary text-white px-2 py-1 rounded">React</span>
                <span className="text-xs bg-success text-white px-2 py-1 rounded">Netlify</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer