import { useEffect, useState } from "react";
import Guess from "./guess";
import Result from "./result";
import { io } from "socket.io-client";
import Scoreboard from "./scoreboard";

export default function Game() {
  let socket;
  const [gameState, setGameState] = useState({
    mode: "guessing",
    name: "frog",
    opponent: "crocodile",
    result: "",
    scoreboard: [
      { name: "frog", score: 2 },
      { name: "crocodile", score: 3 },
    ],
  });

  useEffect(() => {
    socket = io();
    socket.on("message", (msg) => {
      setGameState(JSON.parse(msg));
    });
  }, []);

  function guessANumber(myNumber) {
    socket.emit("message", myNumber);
  }

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch einen Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result result={gameState.result} />
      ) : (
        <Guess gameState={gameState} guessANumber={guessANumber} />
      )}
      <Scoreboard scoreboard={gameState.scoreboard} />
    </div>
  );
}
