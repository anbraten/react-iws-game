import Name from "./name";

export default function Guess(props) {
  let myNumber = 0;

  return (
    <div>
      <Name name={props.name} />
      <p>Guess a number between 1 and 100</p>
      <input
        type="number"
        onChange={(event) => (myNumber = parseInt(event.target.value))}
      />
      <button onClick={() => props.guessANumber(myNumber)}>Guess</button>
    </div>
  );
}
