import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { ThemeProvider } from './context/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
      <App />
)
