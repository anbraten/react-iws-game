import Scoreboard from "./scoreboard";
import Guess from "./guess";
import Result from "./result";

export default function Game() {
  const gameState = {
    mode: "waiting",
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
        <Guess />
      )}
      <Scoreboard />
    </div>
  );
}
