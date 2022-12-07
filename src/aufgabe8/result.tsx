import { useContext } from "react";
import { gameStateCtx } from ".";

export default function Result(props) {
  return <p>{props.result}</p>;
}
