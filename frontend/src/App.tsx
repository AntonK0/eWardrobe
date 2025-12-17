import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Wardrobe from './pages/Wardrobe'
import AddClothings from './pages/AddClothings'
import Suggestions from './pages/Suggestions'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import SavedOutfits from './pages/SavedOutfits'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages (no sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* App pages (with sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/add" element={<AddClothings />} />
          <Route path="/outfits" element={<SavedOutfits />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
