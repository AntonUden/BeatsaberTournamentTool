export default interface LevelData {
    GameVersion: string
    PluginVersion: string
    InLevel: boolean
    LevelPaused: boolean
    LevelFinished: boolean
    LevelFailed: boolean
    LevelQuit: boolean
    Hash: string
    SongName: string
    SongSubName: string
    SongAuthor: string
    Mapper: string
    BSRKey: string
    CoverImage: string
    Duration: number
    MapType: string
    Difficulty: string
    CustomDifficultyLabel: string
    BPM: number
    NJS: number
    Modifiers: Modifiers
    ModifiersMultiplier: number
    PracticeMode: boolean
    PracticeModeModifiers: PracticeModeModifiers
    PP: number
    Star: number
    IsMultiplayer: boolean
    PreviousRecord: number
    PreviousBSR: string
    UnixTimestamp: number
}

export interface Modifiers {
    NoFailOn0Energy: boolean
    OneLife: boolean
    FourLives: boolean
    NoBombs: boolean
    NoWalls: boolean
    NoArrows: boolean
    GhostNotes: boolean
    DisappearingArrows: boolean
    SmallNotes: boolean
    ProMode: boolean
    StrictAngles: boolean
    ZenMode: boolean
    SlowerSong: boolean
    FasterSong: boolean
    SuperFastSong: boolean
}

export interface PracticeModeModifiers {
    SongSpeedMul: number
    StartInAdvanceAndClearNotes: boolean
    SongStartTime: number
}