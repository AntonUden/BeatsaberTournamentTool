import React, { useEffect, useState } from 'react'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext'
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import SavedSession from '../server/session/SavedSession';

interface Props {
	noneText?: string;
	pointsByText?: string;
}

export default function CurrentRecord({noneText = "None", pointsByText = "points by"}: Props) {
	const beatsaber = useBeatsaberTournamentClient();

	const [firstPlace, setFirstPlace] = useState<SavedSession | null>(beatsaber.leaderboard.length == 0 ? null : beatsaber.leaderboard[0]);

	useEffect(() => {
		const handleChange = (newLeaderboard: SavedSession[]) => {
			if (newLeaderboard.length == 0) {
				setFirstPlace(null);
			} else {
				setFirstPlace(newLeaderboard[0]);
			}
		}
		beatsaber.events.on(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleChange);
		return () => {
			beatsaber.events.off(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleChange);
		};
	}, []);

	return (
		<>
			{firstPlace == null ?
				<span>{noneText}</span>
				:
				<>
					<span>{firstPlace.score?.Score}</span> {pointsByText} <span>{firstPlace.user.name}</span>
				</>
			}
		</>
	)
}
