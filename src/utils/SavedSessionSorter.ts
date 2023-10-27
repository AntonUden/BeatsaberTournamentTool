import SavedSession from "../server/session/SavedSession";

export default class SavedSessionSorter {
	static sortByBest(sessions: SavedSession[]) {
		sessions = sessions.sort((a: SavedSession, b: SavedSession) => {
			if(a.score == null || b.score == null) {
				return -1;
			}

			if (a.score.Score > b.score.Score) {
				return -1;
			} else if (a.score < b.score) {
				return 1;
			} else {
				return a.started_at - b.started_at;
			}
		})
		return sessions;
	}
}