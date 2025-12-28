import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

console.log(`DataGym Version: ${__APP_VERSION__}`);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.error("Missing Publishable Key. Authentication will not work.")
  createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-200">
        <h1 className="text-xl font-bold text-red-700 mb-2">Configuration Error</h1>
        <p className="text-gray-700 mb-4">
          Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable.
        </p>
        <p className="text-sm text-gray-500">
          Please add this variable in your Vercel project settings.
        </p>
      </div>
    </div>
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
