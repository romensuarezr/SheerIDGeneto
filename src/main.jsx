import React from 'react'
import ReactDOM from 'react-dom/client'
import {HeroUIProvider} from "@heroui/react"
import { LanguageProvider } from './i18n/LanguageContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider>
      <LanguageProvider>
        <main className="dark text-foreground bg-background min-h-screen">
          <App />
        </main>
      </LanguageProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
