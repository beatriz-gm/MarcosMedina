import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// Global styles first, so component styles can override them.
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'
import App from './App'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.js); development renders from scratch.
if (container.firstElementChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
