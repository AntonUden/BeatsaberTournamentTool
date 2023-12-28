import React, { useEffect, useState } from 'react'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import StateDTO from '../server/dto/StateDTO';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import { sessionActiveWithScore } from '../scripts/SessionUtil';
import CurrentRecord from '../components/CurrentRecord';
import SaveSessionModal from '../components/modals/SaveSessionModal';
import Leaderboard from '../components/leaderboard/Leaderboard';
import ClearLeaderboardModal from '../components/modals/ClearLeaderboardModal';
import toast from 'react-hot-toast';
import ModifierBadges from '../components/ModifierBadges';
import BeatsaberSession from '../server/beatsaber/data/session/BeatsaberSession';
import SettingsMissmatchWarning from '../components/SettingsMissmatchWarning';

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

	function handleClearSettings() {
		console.log("Clear settings");
		beatsaber.clearSettings().then(() => {
			toast.success("Settings cleared");
		}).catch((err) => {
			console.error("Failed to clear settings");
			console.error(err);
			toast.error("An error occured while clearing settings");
		});
	}

	function handleLockSettings() {
		console.log("Lock settings");
		beatsaber.lockSettings().then((success) => {
			if (success) {
				toast.success("Settings locked");
			} else {
				toast.error("Start a game before locking settings");
			}
		}).catch((err) => {
			console.error("Failed to lock settings");
			console.error(err);
			toast.error("An error occured while locking settings");
		});
	}

	const [submitModalVisible, setSubmitModalVisible] = useState<boolean>(false);
	const [clearModalVisible, setClearModalVisible] = useState<boolean>(false);

	return (
		<>
			<Container>
				<Row className='mt-2'>
					<Col>
						<h2>Current Highscore: <CurrentRecord /></h2>
						<hr />
					</Col>
				</Row>

				<Row>
					<Col>
						<SettingsMissmatchWarning />
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
								<h3>
									<div>Difficulty: {state.current_session?.level.Difficulty}</div>
								</h3>
							</Col>
							<Col sm={12} md={12}>
								Modifiers: <span><ModifierBadges modifiers={(state.current_session as BeatsaberSession).level.Modifiers} /></span>
							</Col>
							<Col sm={12} md={12} className='mt-2'>
								<Button className='w-100' onClick={() => { setSubmitModalVisible(true) }} variant='info'>Submit Score</Button>
							</Col>
						</Row>
						:
						<Row>
							<Col>
								Inactive
							</Col>
						</Row>
				}

				<Row>
					<Col>
						<hr />
						<h2>Locked settings:</h2>
					</Col>
				</Row>

				{
					state.locked_settings != null ?
						<Row>
							<Col sm={12} md={6}>
								Level name: {state.locked_settings.level_name}
							</Col>
							<Col sm={12} md={6}>
								Level hash: {state.locked_settings.level_hash}
							</Col>
							<Col sm={12} md={6}>
								Difficulty: {state.locked_settings.difficulty}
							</Col>

							<Col sm={12} md={12}>
								Modifiers: <span><ModifierBadges modifiers={state.locked_settings.modifiers} /></span>
							</Col>
						</Row>
						:
						<Row>
							<Col>
								None
							</Col>
						</Row>
				}

				<Row className='mt-2'>
					<Col>
						<hr />
						<h2>Leaderboard</h2>
						<Leaderboard entryCount={10} showContact showDelete />
					</Col>
				</Row>

				<Row className='mt-2'>
					<Col>
						<hr />
						<h2>Settings</h2>
						<Button variant='danger' className='me-2 mb-2' onClick={() => { setClearModalVisible(true) }}>Clear leaderboard</Button>
						<Button variant='warning' className='me-2 mb-2' onClick={handleClearSettings}>Clear settings</Button>
						<Button variant='info' className='me-2 mb-2' onClick={handleLockSettings}>Lock settings</Button>
					</Col>
				</Row>
			</Container>

			<SaveSessionModal visible={submitModalVisible} onClose={() => { setSubmitModalVisible(false) }} />
			<ClearLeaderboardModal visible={clearModalVisible} onClose={() => { setClearModalVisible(false) }} />
		</>
	)
}
