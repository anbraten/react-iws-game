import { createContext, useContext, useEffect, useState } from "react";
import Guess from "./guess";
import Result from "./result";
import { io } from "socket.io-client";

export const gameStateCtx = createContext({});

export default function Game() {
  let socket;
  const [gameState, setGameState] = useState({
    mode: "guessing",
    name: "Max",
    result: "Du hast gewonnen!",
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
    <gameStateCtx.Provider value={gameState}>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch eine Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess guessANumber={guessANumber} />
      )}
    </gameStateCtx.Provider>
  );
}
