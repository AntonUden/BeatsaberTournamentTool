import LevelData from "../LevelData";
import ScoreData from "../ScoreData";
import { EndReason } from "./EndReason";

export default interface BeatsaberSession {
    uuid: string;
    active: boolean;
	started_at: number;
    level: LevelData;
    paused: boolean;
    score: ScoreData | null;
    end_reason: EndReason;
}