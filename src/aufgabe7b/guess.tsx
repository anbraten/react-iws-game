import Name from "./name";

export default function Guess(props) {
  let myNumber = 0;

  return (
    <div>
      <Name />
      <p>Guess a number between 1 and 100</p>
      <input
        type="number"
        onChange={(event) => (myNumber = event.target.value)}
      />
      <button onClick={() => props.guessANumber(myNumber)}>Guess</button>
    </div>
  );
}
