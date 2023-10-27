import React, { useEffect, useState } from 'react'
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import StateDTO from '../server/dto/StateDTO';
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import { sessionActiveWithScore } from '../scripts/SessionUtil';
import { ProgressBar } from 'react-bootstrap';

export default function HealthBar() {
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

	function getHealthPercentage(state: StateDTO) {
		if (state.current_session == null) {
			return 0;
		}

		if (state.current_session.score == null) {
			return 0;
		}

		return state.current_session.score.PlayerHealth;
	}

	function getHealthColor(state: StateDTO) {
		if (state.current_session == null) {
			return "danger";
		}

		if (state.current_session.score == null) {
			return "danger";
		}

		const health = state.current_session.score.PlayerHealth;

		if (health > 66) {
			return "success";
		} else if (health > 33) {
			return "warning";
		}

		return "danger";
	}

	return (
		<>
			{sessionActiveWithScore(state) ?
				<ProgressBar variant={getHealthColor(state)} now={getHealthPercentage(state)} label={"Health: " + Math.round(getHealthPercentage(state)) + "%"} />
				:
				<ProgressBar variant='danger' now={0} label={"Health: 0%"} />

			}
		</>
	)
}
