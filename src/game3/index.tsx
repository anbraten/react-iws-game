import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";
import confetti from "canvas-confetti";

import "./index.css";

let socket: Socket;

export default function Game() {
  const [gameState, setGameState] = useState<GameState>();
  const [guess, setGuess] = useState("");
  const [youWon, setYouWon] = useState<boolean | null>(null);

  function submitGuess() {
    socket.send(guess);
    setGuess("");
  }

  useEffect(() => {
    socket = io();
    socket.on("message", (msg) => {
      const _gameState: GameState = JSON.parse(msg);
      setGameState(_gameState);

      if (_gameState.me.name) {
        document.title = _gameState.me.name;
      }

      const _youWon =
        _gameState?.result && _gameState.me.guess && _gameState.opponent?.guess
          ? Math.abs(_gameState.result - _gameState.me.guess) <
            Math.abs(_gameState.result - _gameState.opponent.guess)
          : null;

      setYouWon(_youWon);

      if (_youWon) {
        confetti();
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col m-auto max-w-128 min-h-128 p-4">
      {gameState?.me && (
        <span className="flex items-center mb-4 gap-2">
          <img src={gameState.me.avatar} className="w-12 h-12" />
          <span className="text-2xl">Hey {gameState.me.name}!</span>
        </span>
      )}

      <div className="border-t py-4">
        <h1 className="text-2xl mb-6">Guess a number between 1 and 100</h1>

        {!gameState?.opponent && (
          <span className="mb-6">Searching for some skilled opponent ...</span>
        )}

        {!gameState?.result && gameState?.opponent && (
          <div className="flex items-center mb-6 gap-2">
            <img src={gameState.opponent.avatar} className="w-12 h-12" />
            {gameState.opponent.guess ? (
              <span>{gameState.opponent.name} already guess. Hurry up!</span>
            ) : (
              <span>{gameState.opponent.name} is still guessing ...</span>
            )}
          </div>
        )}

        {gameState?.result && gameState.opponent && (
          <div className="flex flex-col">
            <span>The number was: {gameState.result}</span>
            <span>
              {gameState.opponent.name} guess was: {gameState.opponent.guess}
            </span>
            <span>Your guess was: {gameState.me.guess}</span>
            <div className="text-xl">
              {youWon === true ? (
                <span className="text-green-500">You won!</span>
              ) : (
                <span className="text-red-500">You lost :(</span>
              )}
            </div>
          </div>
        )}

        {gameState?.opponent && !gameState?.me.guess && (
          <form
            className="flex gap-2 items-center justify-between"
            onSubmitCapture={(e) => {
              e.preventDefault();
              submitGuess();
            }}
          >
            <input
              type="number"
              placeholder="What's your guess?"
              min="1"
              max="100"
              className="w-56 flex-grow"
              value={guess}
              autoFocus
              onChange={(e) => setGuess(e.target.value)}
            />
            <button type="submit" className="button">
              Guess
            </button>
          </form>
        )}
      </div>

      <div className="flex flex-col mt-8">
        <span className="text-xl mb-2">Scoreboard</span>
        {gameState?.scoreboard.map((player, i) => (
          <div
            key={i}
            className={
              "flex items-center gap-2 border mb-2 p-2 rounded-lg" +
              (player.name === gameState.me.name ? " bg-neutral-600" : "")
            }
          >
            <span>{i + 1}.</span>
            <img src={player.avatar} className="w-12 h-12" />
            <span>{player.name}</span>
            <span className="ml-auto">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
