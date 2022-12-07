import { useState } from "react";
import Name from "./name";

export default function Guess(props) {
  const [guess, setGuess] = useState(0);

  return (
    <div>
      <Name name={props.name} />
      <p>Guess a number between 1 and 100</p>
      <input type="number" onChange={(event) => setGuess(event.target.value)} />
      <button onClick={() => props.guessANumber(guess)}>Guess</button>
    </div>
  );
}
