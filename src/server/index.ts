import express from 'express';
import BeatsaberTournamentServer from './BeatsaberTournamentServer';
import * as fs from 'fs';
import ServerConfig from './config/ServerConfig';

export const app = express();

if (!fs.existsSync("config.json")) {
    const DEFAULT_CONFIG: ServerConfig = {
        beatsaber: {
            host: "127.0.0.1",
            port: 2946
        }
    }
    fs.writeFileSync("config.json", JSON.stringify(DEFAULT_CONFIG, null, 4), 'utf8');
}

const config = JSON.parse(fs.readFileSync("config.json", 'utf8')) as ServerConfig;

new BeatsaberTournamentServer(config, app);