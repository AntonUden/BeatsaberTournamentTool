import { Modifiers } from "./LevelData";
import BeatsaberSession from "./session/BeatsaberSession";

export default interface TournamentSettings {
	level_name: string;
	level_hash: string;
	difficulty: string;
	modifiers: Modifiers;
}

export function tournamentSettingsFromSession(session: BeatsaberSession): TournamentSettings | null {
	if (session.level == null) {
		return null;
	}

	return {
		difficulty: session.level.Difficulty,
		level_hash: session.level.Hash,
		level_name: session.level.SongName,
		modifiers: session.level.Modifiers
	}
}

export function isTournamentSettingsMatching(settings1: TournamentSettings, settings2: TournamentSettings) {
	if (settings1.difficulty != settings2.difficulty) {
		return false;
	}

	if (settings1.level_hash != settings2.level_hash) {
		return false;
	}

	if (settings1.level_name != settings2.level_name) {
		return false;
	}

	for (const key of Object.keys(settings1.modifiers)) {
		if ((settings1.modifiers as any)[key] != (settings2.modifiers as any)[key]) {
			return false;
		}
	}

	return true;
}