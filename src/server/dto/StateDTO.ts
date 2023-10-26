import BeatsaberSession from "../beatsaber/data/session/BeatsaberSession";

export default interface StateDTO {
    connected: boolean;
    current_session: BeatsaberSession | null;
}