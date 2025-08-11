import Header from './Header'
import Footer from './Footer'
import OptimizedSpaceBackground from '../OptimizedSpaceBackground'

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <OptimizedSpaceBackground>
        <div className="min-h-screen flex flex-col relative z-10">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </OptimizedSpaceBackground>
    </div>
  )
}

export default Layout