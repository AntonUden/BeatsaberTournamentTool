import React from 'react'
import { useBeatsaberTournamentClient } from '../../scripts/context/BeatsaberClientContext';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';

interface Props {
	visible: boolean;
	onClose: () => void;
}

export default function ClearLeaderboardModal({ visible, onClose }: Props) {
	const beatsaber = useBeatsaberTournamentClient();

	function handleClear() {
		try {
			beatsaber.clearLeaderboard();
		} catch(err) {
			toast.error("An error occured while trying to clear the leaderboard");
			console.error("Failed to clear leadercoard");
			console.error(err);
			return;
		}

		toast.success("Leaderboard cleared");
		onClose();
	}

	return (
		<Modal show={visible} onHide={onClose}>
			<ModalHeader closeButton>
				<ModalTitle>Clear leaderboard</ModalTitle>
			</ModalHeader>
			<ModalBody>
				Please confirm that you want to clear the leaderboard
			</ModalBody>
			<ModalFooter>
				<Button variant="secondary" onClick={onClose}>
					Cancel
				</Button>
				<Button variant="danger" onClick={handleClear}>
					Clear
				</Button>
			</ModalFooter>
		</Modal>
	)
}
