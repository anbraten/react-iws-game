import scoreboard from "../scoreboard";

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
      ) : (
        <p>Du kannst jetzt raten!</p>
      )}
      <ol>
        {gameState.scoreboard.map((entry, i) => (
          <li key={i}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ol>
    </div>
  );
}
