import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CurrentRecord from '../components/CurrentRecord'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import StateDTO from '../server/dto/StateDTO';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import CurrentScore from '../components/CurrentScore';
import { sessionActiveWithScore } from '../scripts/SessionUtil';
import HealthBar from '../components/HealthBar';
import Leaderboard from '../components/leaderboard/Leaderboard';

export default function LiveStats() {
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
							<Col xs={12} className='mt-1'>
								<HealthBar />
							</Col>
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
