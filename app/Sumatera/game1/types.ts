export interface Piece {
    id: string;
    name: string;
    img: string;
    targetX: number;
    targetY: number;
    width: number;
    height: number;
    isSnapped: boolean;
}

export type GameState = "idle" | "playing" | "won" | "lost";
