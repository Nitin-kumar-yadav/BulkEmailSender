import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'


export const mainUrl = import.meta.env.VITE_BACKEND_URL
const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <StrictMode>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
      </StrictMode>
    </BrowserRouter>
  )
}
