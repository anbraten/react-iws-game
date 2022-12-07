import { createContext, useContext, useState } from "react";
import Guess from "./guess";
import Result from "./result";

export const gameStateCtx = createContext({});

export default function Game() {
  const [gameState, setGameState] = useState({
    mode: "guessing",
    name: "Max",
  });

  function guessANumber(myNumber) {
    alert(myNumber + " is your guess");
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
