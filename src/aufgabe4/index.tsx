import Guess from "./guess";
import Result from "./result";

export default function Game() {
  const gameState: { mode: "waiting" | "guessing" | "result" } = {
    mode: "result",
  };

  const basket = ["apple", "orange", "pear"];

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch eine Mitspieler!</p>
      ) : gameState.mode === "result" ? (
        <Result />
      ) : (
        <Guess />
      )}
      <div>
        {basket.map((entry) => (
          <li>{entry}</li>
        ))}
      </div>
    </div>
  );
}
