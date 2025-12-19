import { Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Wardrobe from './pages/Wardrobe'
import AddClothings from './pages/AddClothings'
import Suggestions from './pages/Suggestions'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import SavedOutfits from './pages/SavedOutfits'
import { Shirt } from 'lucide-react'

function App() {
  const { isLoading } = useAuth0()

  // Show loading screen while Auth0 is initializing (prevents flash during callback)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        <Shirt className="text-[var(--accent-wood-dark)] animate-pulse" size={64} />
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public pages (no sidebar) */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected pages (with sidebar, requires authentication) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/add" element={<AddClothings />} />
          <Route path="/outfits" element={<SavedOutfits />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
