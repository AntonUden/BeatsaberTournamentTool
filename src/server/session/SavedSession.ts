import BeatsaberSession from "../beatsaber/data/session/BeatsaberSession";
import UserData from "./UserData";

export default interface SavedSession extends BeatsaberSession {
    user: UserData;
}