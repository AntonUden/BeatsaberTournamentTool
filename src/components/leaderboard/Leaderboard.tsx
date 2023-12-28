import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import SavedSession from '../../server/session/SavedSession';
import { useBeatsaberTournamentClient } from '../../scripts/context/BeatsaberClientContext';
import { BeatsaberClientEvent } from '../../scripts/BeatsaberTournamentClient';
import LeaderboardEntry from './LeaderboardEntry';

interface Props {
	entryCount: number;
	showContact?: boolean;
	showDelete?: boolean;
}

export default function Leaderboard({ entryCount, showContact = false, showDelete = false }: Props) {
	const beatsaber = useBeatsaberTournamentClient();

	const [topEntries, setTopEntries] = useState<SavedSession[]>(beatsaber.leaderboard.slice(0, entryCount));

	useEffect(() => {
		const handleChange = (newLeaderboard: SavedSession[]) => {
			setTopEntries(newLeaderboard.slice(0, entryCount));
		}
		beatsaber.events.on(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleChange);
		return () => {
			beatsaber.events.off(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleChange);
		};
	}, []);

	return (
		<Table bordered striped hover>
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					{showContact && <th>Contact details</th>}
					<th>Score</th>
					{showDelete && <th/>}
				</tr>
			</thead>

			{topEntries.length == 0 ?
				<>
					<tbody>
						<tr>
							<td colSpan={(showContact ? 1 : 0) + (showDelete ? 1 : 0) + 3}>No entries</td>
						</tr>
					</tbody>
				</>
				:
				<>
					<tbody>
						{topEntries.map((entry, index) => <LeaderboardEntry key={entry.uuid} uuid={entry.uuid} placement={index + 1} session={entry} showContact={showContact} showDelete={showDelete} />)}
					</tbody>
				</>
			}


		</Table>
	)
}
