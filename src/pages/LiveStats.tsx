import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CurrentRecord from '../components/CurrentRecord'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import StateDTO from '../server/dto/StateDTO';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import CurrentScore from '../components/CurrentScore';
import { sessionActiveWithScore, sessionInGame } from '../scripts/SessionUtil';
import HealthBar from '../components/HealthBar';
import Leaderboard from '../components/leaderboard/Leaderboard';
import SavedSession from '../server/session/SavedSession';
import NewRecordText from '../components/NewRecordText';

export default function LiveStats() {
	const beatsaber = useBeatsaberTournamentClient();

	const [state, setState] = useState<StateDTO>(beatsaber.state);
	const [topEntries, setTopEntries] = useState<SavedSession[]>(beatsaber.leaderboard);

	useEffect(() => {
		const handleState = (newState: StateDTO) => {
			setState(newState);
		}

		const handleLeaderboard = (newLeaderboard: SavedSession[]) => {
			setTopEntries(newLeaderboard);
		}


		beatsaber.events.on(BeatsaberClientEvent.STATE_CHANGED, handleState);
		beatsaber.events.on(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleLeaderboard);
		return () => {
			beatsaber.events.off(BeatsaberClientEvent.STATE_CHANGED, handleState);
			beatsaber.events.off(BeatsaberClientEvent.LEADERBOARD_CHANGED, handleLeaderboard);
		};
	}, []);

	function shouldShowNewRecord() {
		if (sessionActiveWithScore(state)) {
			if (topEntries.length > 0) {
				const top = topEntries[0];
				if (top.score != null) {
					if (top.score.Score > 0) {
						if (state.current_session?.score?.Score != null) {
							return state.current_session.score.Score > top.score.Score;
						}
					}
				}
			}
		}
		return false;
	}

	return (
		<>
			<Container className='mt-2'>
				<Row>
					<Col>
						<h2 className='text-center'>
							Current record: <CurrentRecord />
						</h2>
					</Col>
				</Row>

				<Row>
					<Col>
						<hr />
					</Col>
				</Row>

				{sessionActiveWithScore(state) ?
					<>
						<Row>
							<Col xs={12}>
								<h1 className='text-center'>
									Current score: <CurrentScore />
								</h1>
							</Col>
							{sessionInGame(state) && <>
								<Col xs={12} className='mt-1'>
									<HealthBar />
								</Col>
							</>}
						</Row>
					</>
					:
					<>
						<Row>
							<Col xs={12}>
								<h1 className='text-center'>Waiting for game to start...</h1>
							</Col>
						</Row>
					</>
				}

				{shouldShowNewRecord() && <>
					<Row>
						<Col>
							<NewRecordText />
						</Col>
					</Row>
				</>}

				<Row className='mt-4'>
					<Col>
						<span>Leaderboard</span>
						<Leaderboard entryCount={10} />
					</Col>
				</Row>
			</Container>
		</>
	)
}
