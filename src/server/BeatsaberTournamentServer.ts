import { Application } from "express";
import ServerConfig from "./config/ServerConfig";
import BeatsaberWebsocketInterface from "./beatsaber/BeatsaberWebsocketInterface";
import StateDTO from "./dto/StateDTO";
import SavedSession from "./session/SavedSession";
import LeaderboardDTO from "./dto/LeaderboardDTO";
import BeatsaberSession from "./beatsaber/data/session/BeatsaberSession";
import UserData from "./session/UserData";
import * as fs from 'fs';
import SavedSessionSorter from "../utils/SavedSessionSorter";
import bodyParser from 'body-parser';

export default class BeatsaberTournamentServer {
	private _app: Application;
	private _config: ServerConfig;
	private _beatsaberInterface: BeatsaberWebsocketInterface;
	private _savedSessions: SavedSession[];

	constructor(config: ServerConfig, app: Application) {
		console.log("Starting server");
		this._app = app;
		this._config = config;
		this._savedSessions = [];

		if (fs.existsSync("./data/scoreboard.json")) {
			console.log("Reading old scores from ./data/scoreboard.json");
			const sessions = JSON.parse(fs.readFileSync("./data/scoreboard.json", 'utf8')) as SavedSession[];
			console.log(sessions.length + " sessions loaded");
			this._savedSessions = SavedSessionSorter.sortByBest(sessions);
		} else {
			console.log("./data/scoreboard.json not found");
		}

		this._beatsaberInterface = new BeatsaberWebsocketInterface(this, this._config.beatsaber);

		this._app.use(bodyParser.json());

		this._app.post('/api/save_session', (req, res) => {
			const user = req.body as UserData;
			const result = this.saveSession(this._beatsaberInterface.currentSession as BeatsaberSession, user);
			res.json({ success: result });
		});

		this._app.get('/api/state', (_, res) => {
			const data: StateDTO = {
				connected: this._beatsaberInterface.connected,
				current_session: this._beatsaberInterface.currentSession
			}
			res.json(data);
		});

		this._app.get('/api/sessions', (_, res) => {
			const data: LeaderboardDTO = {
				sessions: this.savedSessions
			}
			res.json(data);
		});
	}

	saveSession(session: BeatsaberSession, user: UserData) {
		if (session.score == null) {
			return false;
		}

		const newSavedSession: SavedSession = {
			user: user,
			...session
		}
		this._savedSessions.push(newSavedSession);
		this._savedSessions = SavedSessionSorter.sortByBest(this._savedSessions);

		fs.writeFileSync("./data/scoreboard.json", JSON.stringify(this.savedSessions, null, 4), 'utf8');

		return true;
	}

	get savedSessions() {
		return this._savedSessions;
	}
}