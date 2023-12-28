import React from 'react'
import SavedSession from '../../server/session/SavedSession';
import NumberUtils from '../../utils/NumberUtils';
import { Button } from 'react-bootstrap';
import { useBeatsaberTournamentClient } from '../../scripts/context/BeatsaberClientContext';

interface Props {
	uuid: string;
	placement: number;
	session: SavedSession;
	showContact?: boolean;
	showDelete?: boolean;
}

export default function LeaderboardEntry({ uuid, placement, session, showContact, showDelete }: Props) {
	const beatsaber = useBeatsaberTournamentClient();

	async function deleteEntry() {
		await beatsaber.deleteSession(uuid);
		await beatsaber.pollLeaderboard();
	}

	return (
		<tr>
			<td>{NumberUtils.getOrdinal(placement)}</td>
			<td>{session.user.name}</td>
			{showContact && <td>{session.user.contact_details}</td>}
			<td>{session.score?.Score} points</td>
			{showDelete &&
				<td>
					<Button variant='danger' className='float-end' onClick={deleteEntry}>Remove</Button>
				</td>
			}
		</tr>
	)
}
