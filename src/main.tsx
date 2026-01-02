import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'

const App = lazy(() => import('./App.tsx'))

try {
  console.log(`DataGym Version: ${__APP_VERSION__}`);
} catch (e) {
  console.warn("Version info not available");
}

// Fallback to the hardcoded key if the environment variable is missing (e.g. in GitHub Pages build)
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YW1wbGUtbGFjZXdpbmctOC5jbGVyay5hY2NvdW50cy5kZXYk";

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
          Please add this variable in your deployment settings.
        </p>
      </div>
    </div>
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading DataGym...</p>
              </div>
            </div>
          }>
            <App />
          </Suspense>
        </ClerkProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
}
