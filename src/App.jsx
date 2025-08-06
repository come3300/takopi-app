import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import ConsultationPage from './pages/ConsultationPage'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App