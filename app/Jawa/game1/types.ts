import * as THREE from "three";

export type GameState = "MENU" | "PLAYING" | "WIN" | "LOSE";

export interface NoteData {
  time: number;
  lane: number;
  hit: boolean;
}

export interface ActiveNote {
  data: NoteData;
  mesh: THREE.Mesh;
  id: string; // Unique ID for reacting to updates if needed
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  life: number;
  notesHit: number;
  accuracy: number;
}
