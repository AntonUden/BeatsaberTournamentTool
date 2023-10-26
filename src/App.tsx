import { Route, Routes } from 'react-router-dom'
import './App.css'
import Start from './pages/Start'
import LiveStats from './pages/LiveStats'
import Admin from './pages/Admin'

function App() {
	return (
		<>
			<Routes>
				{/* All our routes */}
				<Route path="/" element={<Start />} />
				<Route path="/live" element={<LiveStats />} />
				<Route path="/admin" element={<Admin />} />

				{/* Error page */}
				<Route path="*" element={<h1>404: Page not found</h1>} />
			</Routes>
		</>
	)
}

export default App
