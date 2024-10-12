import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

async function prepare() {
  if (import.meta.env.DEV && import.meta.env.VITE_API_MOCKING === 'enabled') {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
  return Promise.resolve()
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})