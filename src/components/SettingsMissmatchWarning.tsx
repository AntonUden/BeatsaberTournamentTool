import React, { useEffect, useState } from 'react'
import StateDTO from '../server/dto/StateDTO';
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import TournamentSettings, { isTournamentSettingsMatching, tournamentSettingsFromSession } from '../server/beatsaber/data/TournamentSettings';
import { Alert } from 'react-bootstrap';

export default function SettingsMissmatchWarning() {
	const beatsaber = useBeatsaberTournamentClient();

	const [state, setState] = useState<StateDTO>(beatsaber.state);

	useEffect(() => {
		const handleState = (newState: StateDTO) => {
			setState(newState);
		}
		beatsaber.events.on(BeatsaberClientEvent.STATE_CHANGED, handleState);
		return () => {
			beatsaber.events.off(BeatsaberClientEvent.STATE_CHANGED, handleState);
		};
	}, []);

	function shouldShowWarning(s: StateDTO) {
		if (s.current_session == null || s.locked_settings == null) {
			return false;
		}

		if (s.current_session.level == null) {
			return false;
		}

		return !isTournamentSettingsMatching(tournamentSettingsFromSession(s.current_session) as TournamentSettings, s.locked_settings);
	}

	return (
		<>
			{ shouldShowWarning(state) && <Alert variant='danger'>Settings not matching</Alert>}
		</>
	)
}
