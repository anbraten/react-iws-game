export default function Game() {
  const gameState: { mode: "waiting" } = { mode: "waiting" };

  const basket = ["apple", "orange", "pear"];

  return (
    <div>
      {gameState.mode === "waiting" ? (
        <p>Wir suchen noch eine Mitspieler!</p>
      ) : (
        <p>Du kannst jetzt raten!</p>
      )}
      <div>
        {basket.map((entry) => (
          <li>{entry}</li>
        ))}
      </div>
    </div>
  );
}
