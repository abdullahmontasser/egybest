import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx'
import ErrorBoundary from './Components/ErrorBoundary.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <BrowserRouter basename="/egybest">
              <App />
            </BrowserRouter>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
