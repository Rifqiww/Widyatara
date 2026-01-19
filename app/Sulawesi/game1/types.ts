export type GameMode = "LANGUAGE" | "SYMBOL" | "MENU";

export type GameState =
  | "IDLE"
  | "READY"
  | "COUNTDOWN"
  | "PREVIEW"
  | "PLAYING"
  | "PAUSED"
  | "WON"
  | "LOST";

export interface CardItem {
  id: string;
  content: string;
  image?: string;
  type: "QUESTION" | "ANSWER";
  pairId: string;
  info: string;
  isMatched?: boolean;
}

export interface GameStats {
  timeLeft: number;
}
