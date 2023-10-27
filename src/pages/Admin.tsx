import React, { useEffect, useState } from 'react'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import StateDTO from '../server/dto/StateDTO';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { sessionActiveWithScore } from '../scripts/SessionUtil';
import CurrentRecord from '../components/CurrentRecord';
import SaveSessionModal from '../components/modals/SaveSessionModal';
import Leaderboard from '../components/leaderboard/Leaderboard';

export default function Admin() {
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

	const [submitModalVisible, setSubmitModalVisible] = useState<boolean>(false);

	function showSubmitModal() {
		setSubmitModalVisible(true);
	}

	return (
		<>
			<Container>
				<Row>
					<Col>
						<h2>Current Highscore: <CurrentRecord /></h2>
						<hr />
					</Col>
				</Row>

				<Row>
					<Col>
						<h2>Session details:</h2>
					</Col>
				</Row>

				{
					sessionActiveWithScore(state) ?
						<Row>
							<Col sm={6} md={4}>
								<h3>Score: {state.current_session?.score?.Score}</h3>
							</Col>
							<Col sm={6} md={4}>
								<h3>
									{state.current_session?.active ? <Badge className='mx-1' bg='success'>Active</Badge> : <Badge bg='danger'>Inactive</Badge>}
									{state.current_session?.paused && <Badge className='mx-1' bg='info'>Paused</Badge>}
								</h3>
							</Col>
							<Col sm={6} md={4}>
								<h3>
									<div>Health: {Math.round(state.current_session?.score?.PlayerHealth as number)}</div>
								</h3>
							</Col>
							<Col sm={6} md={4}>
								<Button className='w-100' onClick={showSubmitModal} variant='info'>Submit Score</Button>
							</Col>

						</Row>
						:
						<Row>
							<Col>
								Inactive
							</Col>
						</Row>
				}

				<Row className='mt-2'>
					<Col>
						<hr />
						<h2>Leaderboard</h2>
						<Leaderboard entryCount={10} showContact />
					</Col>
				</Row>

				<Row className='mt-2'>
					<Col>
						<hr />
						<h2>Settings</h2>
						<Button variant='danger'>Clear leaderboard</Button>
					</Col>
				</Row>
			</Container>

			<SaveSessionModal visible={submitModalVisible} onClose={() => { setSubmitModalVisible(false) }} />
		</>
	)
}
