export default function Guess() {
  let myNumber = 0;

  function guessANumber() {
    alert(myNumber + " is your guess");
  }

  return (
    <div>
      <p>Guess a number between 1 and 100</p>
      <input
        type="number"
        onChange={(event) => (myNumber = event.target.value)}
      />
      <button onClick={guessANumber}>Guess</button>
    </div>
  );
}
