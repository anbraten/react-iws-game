import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState } from "../types";
import confetti from "canvas-confetti";

export default function Hello() {
  useEffect(() => {
    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      // keep going until we are out of time
      setTimeout(() => requestAnimationFrame(frame), 100);
    })();
  }, []);

  return (
    <div className="flex flex-col m-auto p-4">
      <h1 className="text-3xl">IWS ist toll! 😀</h1>
    </div>
  );
}
