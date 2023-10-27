import React from 'react'
import SavedSession from '../../server/session/SavedSession';
import NumberUtils from '../../utils/NumberUtils';

interface Props {
	placement: number;
	session: SavedSession;
	showContact?: boolean;
}

export default function LeaderboardEntry({ placement, session, showContact }: Props) {
	return (
		<tr>
			<td>{NumberUtils.getOrdinal(placement)}</td>
			<td>{session.user.name}</td>
			{showContact && <td>{session.user.contact_details}</td>}
			<td>{session.score?.Score} points</td>
		</tr>
	)
}
