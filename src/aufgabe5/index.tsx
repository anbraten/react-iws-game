import Guess from "./guess";
import Result from "./result";

export default function Game() {
  const gameState = {
    mode: "guessing",
    name: "Max",
  };

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch eine Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess name={gameState.name} />
      )}
    </div>
  );
}
