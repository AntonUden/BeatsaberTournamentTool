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
import TournamentSettings, { tournamentSettingsFromSession } from "./beatsaber/data/TournamentSettings";

export default class BeatsaberTournamentServer {
	private _app: Application;
	private _config: ServerConfig;
	private _beatsaberInterface: BeatsaberWebsocketInterface;
	private _savedSessions: SavedSession[];
	private _tournamentSettings: TournamentSettings | null;

	constructor(config: ServerConfig, app: Application) {
		console.log("Starting server");
		this._app = app;
		this._config = config;
		this._savedSessions = [];
		this._tournamentSettings = null;

		if (fs.existsSync("./data/scoreboard.json")) {
			console.log("Reading old scores from ./data/scoreboard.json");
			const sessions = JSON.parse(fs.readFileSync("./data/scoreboard.json", 'utf8')) as SavedSession[];
			console.log(sessions.length + " sessions loaded");
			this._savedSessions = SavedSessionSorter.sortByBest(sessions);
		} else {
			console.log("./data/scoreboard.json not found");
		}

		if (fs.existsSync("./data/tournament_settings.json")) {
			console.log("Reading settings from ./data/tournament_settings.json");
			this._tournamentSettings = JSON.parse(fs.readFileSync("./data/tournament_settings.json", 'utf8')) as TournamentSettings;
		} else {
			console.log("./data/tournament_settings.json not found");
		}

		this._beatsaberInterface = new BeatsaberWebsocketInterface(this, this._config.beatsaber);

		this._app.use(bodyParser.json());

		this._app.delete('/api/clear_leaderboard', (_, res) => {
			this._savedSessions = [];
			this.saveSessionsToFile();
			res.json({ success: true });
		});

		this._app.post('/api/save_session', (req, res) => {
			const user = req.body as UserData;
			const result = this.saveSession(this._beatsaberInterface.currentSession as BeatsaberSession, user);
			res.json({ success: result });
		});

		this._app.delete('/api/clear_settings', (_, res) => {
			this._tournamentSettings = null;
			this.saveTournamentSettings();
			res.json({ success: true });
		});

		this._app.post('/api/clear_current_session', (_, res) => {
			this._beatsaberInterface.currentSession = null;
			res.json({ success: true });
		});

		this._app.delete('/api/detete_session', (req, res) => {
			this.deleteSession(req.query.uuid as string);
			res.json({ success: true });

		});

		this._app.post('/api/lock_settings', (_, res) => {
			let result = false;
			
			if (this._beatsaberInterface.currentSession != null) {
				this._tournamentSettings = tournamentSettingsFromSession(this._beatsaberInterface.currentSession);
				this.saveTournamentSettings();
				result = true;
			}

			res.json({ success: result });
		});

		this._app.get('/api/state', (_, res) => {
			const data: StateDTO = {
				connected: this._beatsaberInterface.connected,
				locked_settings: this.tournamentSesings,
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

		this.saveSessionsToFile();

		return true;
	}

	deleteSession(sessionId: string) {
		console.log("Remove session id: " + sessionId);
		this._savedSessions = this._savedSessions.filter(obj => obj.uuid != sessionId);
		this.saveSessionsToFile();
	}

	saveTournamentSettings() {
		if (this.tournamentSesings == null) {
			if (fs.existsSync("./data/tournament_settings.json")) {
				fs.rmSync("./data/tournament_settings.json");
			}
		} else {
			fs.writeFileSync("./data/tournament_settings.json", JSON.stringify(this.tournamentSesings, null, 4), 'utf8');
		}
	}

	saveSessionsToFile() {
		fs.writeFileSync("./data/scoreboard.json", JSON.stringify(this.savedSessions, null, 4), 'utf8');
	}

	get tournamentSesings() {
		return this._tournamentSettings;
	}

	get savedSessions() {
		return this._savedSessions;
	}
}