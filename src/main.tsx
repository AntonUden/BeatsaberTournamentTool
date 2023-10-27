import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import "./assets/css/bootstrap/vapor/bootstrap.css";
import { BeatsaberTournamentClientContext } from './scripts/context/BeatsaberClientContext.ts';
import BeatsaberTournamentClient from './scripts/BeatsaberTournamentClient.ts';
import { BrowserRouter } from 'react-router-dom';

const beatsaberTournamentClient = new BeatsaberTournamentClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BeatsaberTournamentClientContext.Provider value={beatsaberTournamentClient}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</BeatsaberTournamentClientContext.Provider>
	</React.StrictMode>
)
