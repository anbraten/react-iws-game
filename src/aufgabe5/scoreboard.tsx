export default function Scoreboard(props) {
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
