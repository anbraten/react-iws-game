import { useContext } from "react";

import { gameStateCtx } from "./index";

export default function Name() {
  const gameState = useContext(gameStateCtx);

  return (
    <div>
      <p>Hello {gameState.me.name}</p>
    </div>
  );
}
