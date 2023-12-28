import React, { ChangeEvent, useEffect, useState } from 'react'
import { useBeatsaberTournamentClient } from '../../scripts/context/BeatsaberClientContext';
import { Button, Col, Container, FormControl, FormLabel, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import UserData from '../../server/session/UserData';
import toast from 'react-hot-toast';
import SettingsMissmatchWarning from '../SettingsMissmatchWarning';
import axios from 'axios';

interface Props {
	visible: boolean;
	clearSessionOnSubmit?: boolean;
	onClose: () => void;
}

export default function SaveSessionModal({ visible, onClose, clearSessionOnSubmit = false }: Props) {
	const beatsaber = useBeatsaberTournamentClient();

	const [submitEnable, setSubmitEnable] = useState<boolean>(true);
	const [name, setName] = useState<string>("");
	const [contact, setContact] = useState<string>("");

	useEffect(() => {
		if (visible == true) {
			console.log("Clearing user details");
			setName("");
			setContact("");
		}
	}, [visible]);

	async function handleSave() {
		if (name.trim().length == 0) {
			toast.error("Name cant be empty");
			return;
		}

		setSubmitEnable(false);
		const contactInfo: UserData = {
			name: name,
			contact_details: contact
		}

		try {
			if (await beatsaber.submitSession(contactInfo)) {
				if(clearSessionOnSubmit) {
					await axios.post("/api/clear_current_session");
					await beatsaber.pollState();
				}
				await beatsaber.pollLeaderboard();
				toast.success("Score saved");
				setSubmitEnable(true);
				onClose();
			} else {
				toast.error("Failed to save score");
				setSubmitEnable(true);
			}
		} catch (err) {
			toast.error("An exception occured while trying to save the score");
			setSubmitEnable(true);
			console.error("Failed to save session");
			console.error(err);
		}
	}

	function handleNameChange(e: ChangeEvent<any>) {
		setName(e.target.value);
	}

	function handleContactChange(e: ChangeEvent<any>) {
		setContact(e.target.value);
	}

	return (
		<Modal show={visible} onHide={onClose}>
			<ModalHeader closeButton>
				<ModalTitle>Submit score</ModalTitle>
			</ModalHeader>
			<ModalBody>
				<Container fluid>
					<Row>
						<Col>
							<SettingsMissmatchWarning />
							<FormLabel>Display name</FormLabel>
							<FormControl type='text' placeholder='Display name' value={name} onChange={handleNameChange} />
						</Col>
					</Row>

					<Row className='mt-2'>
						<Col>
							<FormLabel>Contact info</FormLabel>
							<FormControl type='text' placeholder='Contact info' value={contact} onChange={handleContactChange} />
						</Col>
					</Row>
				</Container>
			</ModalBody>
			<ModalFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="success" disabled={!submitEnable} onClick={handleSave}>
					Submit
				</Button>
			</ModalFooter>
		</Modal>
	)
}
