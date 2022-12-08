import Scoreboard from "./scoreboard";
import Guess from "./guess";
import Result from "./result";

export default function Game() {
  const gameState = {
    mode: "result",
    name: "frog",
    opponent: "crocodile",
    result: "",
    scoreboard: [
      { name: "frog", score: 2 },
      { name: "crocodile", score: 3 },
    ],
  };

  function guessANumber(myNumber) {
    alert(myNumber + " is your guess");
  }

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch einen Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess name={gameState.name} guessANumber={guessANumber} />
      )}
      <Scoreboard scoreboard={gameState.scoreboard} />
    </div>
  );
}
