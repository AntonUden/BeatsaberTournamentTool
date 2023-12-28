import WebSocket from 'ws';
import BeatsaberConfig from "../config/BeatsaberConfig";
import LevelData from './data/LevelData';
import ScoreData from './data/ScoreData';
import BeatsaberSession from './data/session/BeatsaberSession';
import BeatsaberTournamentServer from '../BeatsaberTournamentServer';
import UUID from '../../utils/UUID';
import { EndReason } from './data/session/EndReason';

export default class BeatsaberWebsocketInterface {
    private _server: BeatsaberTournamentServer;
    private _liveWS: WebSocket;
    private _mapWS: WebSocket;

    private _currentSession: BeatsaberSession | null;
    private _connected: boolean;

    constructor(server: BeatsaberTournamentServer, config: BeatsaberConfig) {
        console.log("Creating socket");
        this._server = server;
        this._currentSession = null;
        this._connected = false;

        const CONNECTION_STRING_LIVE = "ws://" + config.host + ":" + config.port + "/BSDataPuller/LiveData";
        const CONNECTION_STRING_MAP = "ws://" + config.host + ":" + config.port + "/BSDataPuller/MapData";
        console.log("Connection string live: " + CONNECTION_STRING_LIVE);
        console.log("Connection string map: " + CONNECTION_STRING_MAP);

        this._liveWS = new WebSocket(CONNECTION_STRING_LIVE);
        this._liveWS.on("open", () => { this.onLiveOpen() });
        this._liveWS.on("close", () => { this.onLiveClose() });
        this._liveWS.on("message", (messageBuffer: any) => { this.onLiveMessage(JSON.parse(Buffer.from(messageBuffer).toString('utf-8')) as ScoreData) });

        this._mapWS = new WebSocket(CONNECTION_STRING_MAP);
        this._mapWS.on("open", () => { this.onMapOpen() });
        this._mapWS.on("close", () => { this.onMapClose() });
        this._mapWS.on("message", (messageBuffer: any) => { this.onMapMessage(JSON.parse(Buffer.from(messageBuffer).toString('utf-8')) as LevelData) });
    }

    get currentSession(): BeatsaberSession | null {
        return this._currentSession;
    }

	set currentSession(newData: BeatsaberSession | null) {
		this._currentSession = newData;
	}

    get connected(): boolean {
        return this._connected;
    }

    private onLiveOpen() {
        console.log("Beatsaber live socket connected");
        this._connected = true;
    }

    private onLiveClose() {
        console.log("Beatsaber live socket disconnected");
        this._connected = false;
    }

    private onMapOpen() {
        console.log("Beatsaber map socket connected");
        this._connected = true;
    }

    private onMapClose() {
        console.log("Beatsaber map socket disconnected");
        this._connected = false;
    }

    private onMapMessage(mapData: LevelData) {
        let newSession = false;
        if (this._currentSession == null) {
            console.log("Creating initial session");
            newSession = true;
        } else if (!this._currentSession.level.InLevel && mapData.InLevel) {
            console.log("New session since InLevel changed fron false to true");
            newSession = true;
        }

        if (newSession) {
            const uuid = UUID.v4();
            console.log("Stating new session with id: " + uuid);
            this._currentSession = {
                active: true,
                end_reason: EndReason.NONE,
				started_at: new Date().getTime(),
                uuid: uuid,
                paused: false,
                level: mapData,
                score: null
            }
        } else {
            if (this._currentSession != null) {
                if(this._currentSession.active) {
                    this._currentSession.paused = mapData.LevelPaused;
                    if(!mapData.InLevel) {
                        this._currentSession.active = false;
                        if(mapData.LevelFailed) {
                            this._currentSession.end_reason = EndReason.FAILED;
                        } else if(mapData.LevelFinished) {
                            this._currentSession.end_reason = EndReason.FINISHED;
                        } else if(mapData.LevelQuit) {
                            this._currentSession.end_reason = EndReason.QUIT;
                        }
                        this._currentSession.paused = false;
						console.log("Session ended with reason " + this._currentSession.end_reason);
                    }
                }

                this._currentSession.level = mapData;
            }
        }
    }

    private onLiveMessage(liveData: ScoreData) {
        if (this._currentSession == null) {
            return;
        }
        this._currentSession.score = liveData;
    }
}