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
  opponent?: Player & Guess;
  me: Player & Guess;
  result: number | null;
  scoreboard: ScoreboardPlayer[];
};

export type Lobby = {
  player1?: Player & Guess;
  player2?: Player & Guess;
  result: number;
  created: Date;
};
