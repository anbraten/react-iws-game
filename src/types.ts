import { Socket } from "socket.io";

export type Player = {
  name: string;
  avatar: string;
  socket?: Socket;
};

export type ScoreboardPlayer = Player & {
  score: number;
};

export type Guess = {
  guess: number | null;
};

export type GameState = {
  mode: "guess" | "waiting" | "result";
  name: string;
  opponent?: string;
  state: string;
  result?: string;
  magicNumber?: number;
  scoreboard: ScoreboardPlayer[];
  other?: Player & Guess;
  me: Player & Guess;
};

export type Lobby = {
  player1?: Player & Guess;
  player2?: Player & Guess;
  result: number;
  created: Date;
};
