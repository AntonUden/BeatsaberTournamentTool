import React, { useEffect, useState } from 'react'
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import CurrentRecord from '../components/CurrentRecord'
import { useBeatsaberTournamentClient } from '../scripts/context/BeatsaberClientContext';
import StateDTO from '../server/dto/StateDTO';
import { BeatsaberClientEvent } from '../scripts/BeatsaberTournamentClient';
import TournamentSettings, { isTournamentSettingsMatching, tournamentSettingsFromSession } from '../server/beatsaber/data/TournamentSettings';
import Leaderboard from '../components/leaderboard/Leaderboard';
import NewRecordText from '../components/NewRecordText';
import { sessionActiveWithScore } from '../scripts/SessionUtil';
import SavedSession from '../server/session/SavedSession';
import { all } from 'axios';
import SaveSessionModal from '../components/modals/SaveSessionModal';

export default function UnattendedSE() {
	const beatsaber = useBeatsaberTournamentClient();

	const [state, setState] = useState<StateDTO>(beatsaber.state);
	const [topEntries, setTopEntries] = useState<SavedSession[]>(beatsaber.leaderboard);
	const [submitModalVisible, setSubmitModalVisible] = useState<boolean>(false);

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

	function shouldShowWarning(s: StateDTO) {
		if (s.current_session == null || s.locked_settings == null) {
			return false;
		}

		if (s.current_session.level == null) {
			return false;
		}

		return !isTournamentSettingsMatching(tournamentSettingsFromSession(s.current_session) as TournamentSettings, s.locked_settings);
	}

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
			} else {
				return true;
			}
		}
		return false;
	}

	let correctLevel = true;
	let correctDifficulty = true;
	let allOk = true;

	const turnOnModifier: string[] = [];
	const turnOffModifier: string[] = [];

	if (state.current_session != null && state.locked_settings != null) {
		if (state.current_session.level != null) {
			const currentSettings = tournamentSettingsFromSession(state.current_session) as TournamentSettings;
			const lockedSettings = state.locked_settings;


			if (currentSettings.difficulty != lockedSettings.difficulty) {
				correctDifficulty = false;
				allOk = false;
			}

			if (currentSettings.level_name != lockedSettings.level_name) {
				correctLevel = false;
				allOk = false;
			}

			for (const key of Object.keys(currentSettings.modifiers)) {
				if ((currentSettings.modifiers as any)[key] != (lockedSettings.modifiers as any)[key]) {

					if ((currentSettings.modifiers as any)[key] == true) {
						turnOffModifier.push(key);
					} else {
						turnOnModifier.push(key);
					}
					allOk = false;
				}
			}
		}
	}

	function showSubmit() {
		setSubmitModalVisible(true);
	}

	let currentScore: number = 0;
	if (state.current_session != null) {
		if (state.current_session.score != null) {
			currentScore = state.current_session.score.Score;
		}
	}


	return (
		<>
			<Container>
				<Row>
					<Col>
						<h2>Nuvarande rekord: <CurrentRecord noneText='Inget' pointsByText="poäng av" /></h2>
						<hr />
						<h2>Dina poäng: {currentScore}</h2>

						{shouldShowNewRecord() && <>
							<NewRecordText text='Nytt rekord!' />
						</>}
					</Col>
				</Row>

				<Row>
					<Col>
						<h1 className='text-center'>
							{allOk ?
								<Badge bg="success">Redo att köra</Badge>
								:
								<Badge bg="danger">Fel inställningar</Badge>
							}
						</h1>

						{!correctLevel &&
							<h5 className="text-danger">Byt bana till {state.locked_settings?.level_name}</h5>
						}

						{!correctDifficulty &&
							<h5 className="text-danger">Byt svårighetsgrad till {state.locked_settings?.difficulty}</h5>
						}

						{turnOnModifier.length > 0 &&
							<h5 className="text-danger">Aktivera följande:
								{
									turnOnModifier.map(e => <span key={e}>{e}&nbsp;</span>)
								}
							</h5>
						}

						{turnOffModifier.length > 0 &&
							<h5 className="text-danger">Stäng av följande:
								{
									turnOffModifier.map(e => <span key={e}>{e}&nbsp;</span>)
								}
							</h5>
						}
					</Col>
				</Row>

				<Row>
					<Col>
						<p>Följ instruktionerna nedan i ordning för att raportera</p>
						<ul>
							<li>Kontrollera så att det står "Redo att köra". Om det står "Fel inställningar" kontakta en admin</li>
							<li>Sätt på dig VR headsetet</li>
							<li>Kör banan {state.locked_settings?.level_name}</li>
							<li>Ta av dig headsetet</li>
							<li>Klicka på "Spara resultat"</li>
							<li>Fyll i ditt namn, kontaktuppgifter och klicka på "Submit"</li>
						</ul>
						<p>
							Behöver du hjälp eller om något krånglar kontakta en admin
						</p>
					</Col>
				</Row>

				<Row>
					<Col>
						<Button variant='success' disabled={!allOk || currentScore == 0} onClick={showSubmit}>Spara resultat</Button>
					</Col>
				</Row>

				<Row className='mt-4'>
					<h4>Leaderboard:</h4>
					<Leaderboard entryCount={20} />
				</Row>

			</Container>

			<SaveSessionModal clearSessionOnSubmit visible={submitModalVisible} onClose={() => { setSubmitModalVisible(false) }} />
		</>
	)
}
