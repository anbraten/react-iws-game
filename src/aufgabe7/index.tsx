import { useState } from "react";
import Guess from "./guess";
import Result from "./result";

export default function Game() {
  const [gameState, setGameState] = useState({
    mode: "guessing",
    name: "Max",
  });

  function guessANumber(myNumber) {
    alert(myNumber + " is your guess");
  }

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch eine Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess name={gameState.name} guessANumber={guessANumber} />
      )}
    </div>
  );
}
