import Guess from "./guess";
import Result from "./result";
import Scoreboard from "./scoreboard";

export default function Game() {
  const gameState = {
    mode: "guessing",
    name: "frog",
    opponent: "crocodile",
    result: "",
    scoreboard: [
      { name: "frog", score: 2 },
      { name: "crocodile", score: 3 },
    ],
  };

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch einen Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess name={gameState.name} />
      )}
      <Scoreboard scoreboard={gameState.scoreboard} />
    </div>
  );
}
