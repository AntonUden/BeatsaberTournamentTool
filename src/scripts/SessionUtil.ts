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