export default function Scoreboard(props) {
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
    <ol>
      {props.scoreboard.map((entry, i) => (
        <li key={i}>
          {entry.name}: {entry.score}
        </li>
      ))}
    </ol>
  );
}
