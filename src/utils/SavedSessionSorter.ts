import ScoreData from "../server/beatsaber/data/ScoreData";
import SavedSession from "../server/session/SavedSession";

export default class SavedSessionSorter {
	static sortByBest(sessions: SavedSession[]) {
		sessions = sessions.sort((a: SavedSession, b: SavedSession) => (b.score as ScoreData).Score - (a.score as ScoreData).Score);
		return sessions;
	}
}