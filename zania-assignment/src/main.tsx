import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { worker } from './mocks/browser'


async function startMSW() {
  // Start the worker in all environments
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  })
}

startMSW().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})