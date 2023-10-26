export default interface ScoreData {
    Score: number
    ScoreWithMultipliers: number
    MaxScore: number
    MaxScoreWithMultipliers: number
    Rank: string
    FullCombo: boolean
    NotesSpawned: number
    Combo: number
    Misses: number
    Accuracy: number
    BlockHitScore: BlockHitScore
    PlayerHealth: number
    ColorType: number
    TimeElapsed: number
    EventTrigger: number
    UnixTimestamp: number
}

export interface BlockHitScore {
    PreSwing: number
    PostSwing: number
    CenterSwing: number
}
