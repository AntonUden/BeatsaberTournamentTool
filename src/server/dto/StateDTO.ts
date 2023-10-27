import TournamentSettings from "../beatsaber/data/TournamentSettings";
import BeatsaberSession from "../beatsaber/data/session/BeatsaberSession";

export default interface StateDTO {
    connected: boolean;
    current_session: BeatsaberSession | null;
	locked_settings: TournamentSettings | null;
}