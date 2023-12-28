import { Route, Routes } from 'react-router-dom'
import './App.css'
import Start from './pages/Start'
import LiveStats from './pages/LiveStats'
import Admin from './pages/Admin'
import { Toaster } from 'react-hot-toast'
import UnattendedSE from './pages/UnattendedSE'

function App() {
	return (
		<>
			<Routes>
				{/* All our routes */}
				<Route path="/" element={<Start />} />
				<Route path="/live" element={<LiveStats />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/unattended_se" element={<UnattendedSE />} />

				{/* Error page */}
				<Route path="*" element={<h1>404: Page not found</h1>} />
			</Routes>

			<Toaster />
		</>
	)
}

export default App
