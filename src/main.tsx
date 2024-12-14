import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Area_easing from './areas/easing/easing.tsx'
import './areas/easing/easing.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <Area_easing />
  </StrictMode>,
)
