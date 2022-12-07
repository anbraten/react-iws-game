import { useEffect, useState } from "react";
import { Lobby, ScoreboardPlayer } from "../types";
import { io } from "socket.io-client";
import "./index.css";

export default function () {
  const [scoreboard, setScoreboard] = useState<ScoreboardPlayer[]>([]);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    const socket = io("", {
      path: "/scoreboard/socket.io",
      transports: ["websocket"],
    });
    socket.on("message", (event) => {
      const msg: { lobbies: Lobby[]; scoreboard: ScoreboardPlayer[] } =
        JSON.parse(event);
      setLobbies(msg.lobbies);
      setScoreboard(msg.scoreboard);
    });

    return () => {
      console.log("closing socket");
      socket.close();
    };
  }, []);

  return (
    <div className="flex flex-col m-auto">
      <div>
        <div className="text-2xl mb-2">Scoreboard</div>
        {scoreboard.map((player, i) => (
          <div
            key={i}
            className="flex items-center gap-2 border mb-2 p-2 rounded-lg"
          >
            <span>{i + 1}.</span>
            <img src={player.avatar} className="w-12 h-12" />
            <span>{player.name}</span>
            <span className="ml-auto">{player.score}</span>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="text-2xl mb-2">Lobbies</div>
        {lobbies.map((lobby, i) => (
          <div
            key={i}
            className="flex gap-2 items-center justify-between border p-2 rounded-lg mb-2"
          >
            <div className="flex items-center gap-2 w-64">
              {lobby.player1 ? (
                <>
                  <img src={lobby.player1.avatar} className="w-12 h-12" />
                  <span>{lobby.player1.name}</span>
                </>
              ) : (
                <span className="ml-4">...</span>
              )}
            </div>
            <span className="font-bold">vs.</span>
            <div className="flex items-center justify-end gap-2 w-64">
              {lobby.player2 ? (
                <>
                  <span>{lobby.player2.name}</span>
                  <img src={lobby.player2.avatar} className="w-12 h-12" />
                </>
              ) : (
                <span className="mr-4">...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
