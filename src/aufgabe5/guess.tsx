import Name from "./name";

export default function Guess(props) {
  return (
    <div>
      <Name name={props.name} />
      <p>Guess a number between 1 and 100</p>
    </div>
  );
}
