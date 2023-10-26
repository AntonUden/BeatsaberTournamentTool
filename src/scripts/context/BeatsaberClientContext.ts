import { createContext, useContext } from 'react';
import BeatsaberTournamentClient from '../BeatsaberTournamentClient';

export const BeatsaberTournamentClientContext = createContext<BeatsaberTournamentClient | undefined>(undefined);

export function useBeatsaberTournamentClient() {
	const context = useContext(BeatsaberTournamentClientContext);
	if (!context) {
		throw new Error('useBeatsaberTournamentClient must be used within a BeatsaberTournamentClientProvider');
	}
	return context;
}