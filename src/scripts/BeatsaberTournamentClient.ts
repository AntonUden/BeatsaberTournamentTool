import axios from "axios";
import StateDTO from "../server/dto/StateDTO";
import deepCompareObject from "../utils/DeepCompare";
import LeaderboardDTO from "../server/dto/LeaderboardDTO";
import SavedSession from "../server/session/SavedSession";
import EventEmitter from "../utils/EventEmitter";
import UserData from "../server/session/UserData";
import SavedSessionSorter from "../utils/SavedSessionSorter";

export enum BeatsaberClientEvent {
	STATE_CHANGED = "stateChanged",
	LEADERBOARD_CHANGED = "leaderboardChange",
}

export default class BeatsaberTournamentClient {
	private _state: StateDTO;
	private _events = new EventEmitter();
	private _leaderboard: SavedSession[];

	constructor() {
		this._state = {
			connected: false,
			current_session: null,
			locked_settings: null
		};
		this._leaderboard = [];

		setInterval(() => { this.pollState() }, 250);
		setInterval(() => { this.pollLeaderboard() }, 2000);

		this.pollState();
		this.pollLeaderboard();
	}

	async pollState() {
		const response = await axios.get("/api/state");
		const newState = response.data as StateDTO;

		if (!deepCompareObject(newState, this._state)) {
			this._state = newState;
			this.events.emit(BeatsaberClientEvent.STATE_CHANGED, this._state);
		}
	}

	async pollLeaderboard() {
		const response = await axios.get("/api/sessions");
		const newLeaderboard = response.data as LeaderboardDTO;
		const sessions = SavedSessionSorter.sortByBest(newLeaderboard.sessions);
		if (!deepCompareObject(sessions, this._leaderboard)) {
			this._leaderboard = sessions;
			this.events.emit(BeatsaberClientEvent.LEADERBOARD_CHANGED, this._leaderboard);
		}
	}

	get events(): EventEmitter {
		return this._events;
	}

	get state(): StateDTO {
		return this._state;
	}

	get leaderboard(): SavedSession[] {
		return this._leaderboard
	}

	async submitSession(user: UserData) {
		const response = await axios.post('/api/save_session', user, {
			headers: {
				'Content-Type': 'application/json'
			},
		});
		if (response.data.success == true) {
			return true;
		}
		return false;
	}

	async deleteSession(sessionId: string) {
		await axios.delete("/api/detete_session?uuid=" + sessionId);
	}

	async clearLeaderboard() {
		await axios.delete("/api/clear_leaderboard");
	}

	async lockSettings() {
		const response = await axios.post("/api/lock_settings");
		if (response.data.success == true) {
			return true;
		}
		return false;
	}

	async clearSettings() {
		await axios.delete("/api/clear_settings");
	}
}