import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeDemoUsers } from './utils/initializeDemo'
import { migrateInitialData } from './utils/migrateInitialData'
import { Toaster } from 'sonner'

// Initialize demo data
initializeDemoUsers();
migrateInitialData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" richColors />
  </StrictMode>,
)


