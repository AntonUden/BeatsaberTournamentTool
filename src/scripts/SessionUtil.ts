import StateDTO from "../server/dto/StateDTO";

export function sessionActiveWithScore(state: StateDTO) {
	if (state.current_session == null) {
		return false;
	}

	if (state.current_session.score == null) {
		return false;
	}

	return true;
}

export function sessionInGame(state: StateDTO) {
	if (state.current_session == null) {
		return false;
	}

	if (state.current_session.level == null) {
		return false;
	}

	return state.current_session.level.InLevel;
}