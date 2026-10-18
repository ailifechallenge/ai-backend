import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Workspace } from './integrated/hooks/workspace'
import { MobileRuntime } from './integrated/features/mobile/MobileRuntime'
import './styles/features.css'
import './styles/global.css'
import './styles/integration.css'
import './styles.css'
import App from './App'
import {NativeLaunchScreen} from './components/NativeLaunchScreen'

const client = new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:true},mutations:{retry:false}}})
createRoot(document.getElementById('root')!).render(
  <StrictMode><QueryClientProvider client={client}><BrowserRouter><Workspace><MobileRuntime><NativeLaunchScreen/><App /></MobileRuntime></Workspace></BrowserRouter></QueryClientProvider></StrictMode>,
)
