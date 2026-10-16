import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { AlertProvider } from '@/context/AlertContext'
import { HealthProvider } from '@/context/HealthContext'
import { ScenarioProvider } from '@/context/ScenarioContext'
import AlertDetail from '@/pages/AlertDetail'
import Chat from '@/pages/Chat'
import EvacuationMap from '@/pages/EvacuationMap'
import Home from '@/pages/Home'
import Loading from '@/pages/Loading'
import Onboarding from '@/pages/Onboarding'
import Prepare from '@/pages/Prepare'
import Schedule from '@/pages/Schedule'

function Root() {
  return (
    <ScenarioProvider>
      <HealthProvider>
        <AlertProvider>
          <Outlet />
        </AlertProvider>
      </HealthProvider>
    </ScenarioProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Loading /> },
          { path: '/onboarding', element: <Onboarding /> },
          { path: '/home', element: <Home /> },
          { path: '/alert/:id', element: <AlertDetail /> },
          { path: '/alert/:id/evacuation', element: <EvacuationMap /> },
          { path: '/schedule', element: <Schedule /> },
          { path: '/chat', element: <Chat /> },
          { path: '/prepare', element: <Prepare /> },
          { path: '*', element: <Navigate to="/home" replace /> },
        ],
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
