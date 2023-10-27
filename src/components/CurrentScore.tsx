import React, { useEffect, useState } from 'react'
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import StateDTO from '../server/dto/StateDTO';
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import { sessionActiveWithScore } from '../scripts/SessionUtil';

export default function CurrentScore() {
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

	return (
		<>
			{sessionActiveWithScore(state) ?
				<>
					{/* @ts-ignore: Object is possibly 'null'. */}
					<span>{state.current_session.score?.Score}</span>
				</>
				:
				<span>...</span>

			}
		</>
	)
}
