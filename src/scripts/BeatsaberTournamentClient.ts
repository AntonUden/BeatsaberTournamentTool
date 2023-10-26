import axios from "axios";
import StateDTO from "../server/dto/StateDTO";
import deepCompareObject from "../utils/DeepCompare";
import { EventEmitter } from "../utils/EventEmitter";


export default class BeatsaberTournamentClient {
	private _state: StateDTO;
	private _events = new EventEmitter();

	constructor() {
		this._state = {
			connected: false,
			current_session: null
		};

		setInterval(() => { this.pollServer() }, 250)
	}

	async pollServer() {
		const response = await axios.get("/api/state");
		const newState = response.data as StateDTO;
		const changed = !deepCompareObject(newState, this._state);
		this._state = newState;

		if (changed) {
			console.log("State changed");
			console.log(this._state);
			this.events.emit(BeatsaberClientEvent.STATE_CHANGED, this._state);
		}
	}

	get events(): EventEmitter {
		return this._events;
	}

	get state(): StateDTO {
		return this._state;
	}
}

export enum BeatsaberClientEvent {
	STATE_CHANGED = "stateChanged"
}