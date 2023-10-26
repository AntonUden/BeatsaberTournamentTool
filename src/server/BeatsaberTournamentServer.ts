import { Application } from "express";
import ServerConfig from "./config/ServerConfig";
import BeatsaberWebsocketInterface from "./beatsaber/BeatsaberWebsocketInterface";
import StateDTO from "./dto/StateDTO";

export default class BeatsaberTournamentServer {
	private _app: Application;
	private _config: ServerConfig;
	private _beatsaberInterface: BeatsaberWebsocketInterface;

	constructor(config: ServerConfig, app: Application) {
		console.log("Starting server");
		this._app = app;
		this._config = config;

		this._beatsaberInterface = new BeatsaberWebsocketInterface(this, this._config.beatsaber);

		this._app.get('/api/state', (_, res) => {
			const data: StateDTO = {
				connected: this._beatsaberInterface.connected,
				current_session: this._beatsaberInterface.currentSession
			}
			res.json(data);
		});
	}
}