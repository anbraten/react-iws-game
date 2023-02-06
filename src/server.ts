import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { GameState, ScoreboardPlayer, Player, Guess } from "./types";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import generateAvatar from "animal-avatar-generator";

function generateName() {
  return uniqueNamesGenerator({
    dictionaries: [animals],
    length: 1,
    separator: " ",
  });
}

const boardConnections: Socket[] = [];
const lobbies: Lobby[] = [];

class PlayerIndex {
  private players = new Map<string, ScoreboardPlayer & { socket: Socket }>();

  addPlayer(name: string, socket: Socket) {
    const avatar = generateAvatar(name, {
      backgroundColors: ["transparent"],
    });
    const svgToDataURL = (svgStr: string) => {
      const encoded = encodeURIComponent(svgStr)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");

      const header = "data:image/svg+xml,";
      const dataUrl = header + encoded;

      return dataUrl;
    };

    this.players.set(name, {
      name,
      score: 0,
      avatar: svgToDataURL(avatar),
      socket,
    });
    joinLobby(name);
  }

  removePlayer(name: string) {
    leaveLobby(name);
    this.players.delete(name);
    sendScoreboardUpdates();
  }

  getPlayer(name?: string) {
    if (!name) {
      return undefined;
    }

    return this.players.get(name);
  }

  increasePlayerScore(name: string, increase: number) {
    const player = this.players.get(name);
    if (!player) {
      return;
    }

    player.score = player.score + increase;
    this.players.set(name, player);
  }

  getScoreboard() {
    return Array.from(this.players.values())
      .map((player) => {
        const { socket, ...rest } = player;
        return rest;
      })
      .sort((a, b) => b.score - a.score);
  }
}

const players = new PlayerIndex();

class Lobby {
  player1?: Player & Guess;
  player2?: Player & Guess;
  result = 0;
  created: Date;

  constructor() {
    this.result = Math.floor(Math.random() * 100);
    this.created = new Date();
  }

  getMode() {
    if (!this.player1 || !this.player2) {
      return "waiting";
    }

    if (this.player1.guess && this.player2.guess) {
      return "result";
    }

    return "guess";
  }

  getState(name: string) {
    if (!this.player1 || !this.player2) {
      return "Waiting for opponent ...";
    }

    const me = this.getPlayer(name);
    const opponent = this.getOpponent(name);

    if (!me.guess) {
      return "Waiting for you to guess ...";
    }

    if (!opponent.guess) {
      return "Waiting for opponent to guess ...";
    }

    const meDiff = Math.abs(me.guess - this.result);
    const opponentDiff = Math.abs(opponent.guess - this.result);

    if (meDiff === opponentDiff) {
      return "Draw!";
    }

    if (meDiff === 0) {
      return "Hooray, you guessed correctly!";
    }

    if (opponentDiff === 0) {
      return `${opponent.name} guessed correctly!`;
    }

    if (meDiff < opponentDiff) {
      return `You were closest!`;
    } else {
      return `${opponent.name} was closest!`;
    }
  }

  getPlayer(name: string) {
    return this.player1?.name === name ? this.player1 : this.player2;
  }

  getOpponent(name: string) {
    return this.player1?.name === name ? this.player2 : this.player1;
  }

  getGameState(name: string): GameState {
    const me = this.getPlayer(name);

    const gameState: GameState = {
      mode: this.getMode(),
      state: this.getState(name),
      result: this.getState(name),
      magicNumber: this.getMode() === "result" ? this.result : undefined,
      me: {
        name,
        avatar: me!.avatar,
        guess: this.getPlayer(name)?.guess ?? null,
      },
      name,
      other: undefined,
      opponent: undefined,
      scoreboard: players.getScoreboard(),
    };

    const opponent = this.getOpponent(name);
    if (opponent) {
      gameState.other = {
        name: opponent.name,
        avatar: opponent.avatar,
        guess: opponent.guess,
      };
      gameState.opponent = opponent.name;
    }

    return gameState;
  }

  sendUpdate() {
    const player1 = players.getPlayer(this.player1?.name);
    if (player1) {
      player1.socket.send(JSON.stringify(this.getGameState(player1.name)));
    }

    const player2 = players.getPlayer(this.player2?.name);
    if (player2) {
      player2.socket.send(JSON.stringify(this.getGameState(player2.name)));
    }

    sendScoreboardUpdates();
  }
}

function sendScoreboardUpdates() {
  const _scoreboard = players.getScoreboard();
  const _lobbies = lobbies.map((lobby) => {
    return {
      ...lobby,
      player1: lobby.player1
        ? {
            name: lobby.player1?.name,
            avatar: lobby.player1?.avatar,
            guess: lobby.player1?.guess,
          }
        : undefined,
      player2: lobby.player2
        ? {
            name: lobby.player2?.name,
            avatar: lobby.player2?.avatar,
            guess: lobby.player2?.guess,
          }
        : undefined,
    };
  });

  boardConnections.forEach((ws) => {
    ws.send(JSON.stringify({ lobbies: _lobbies, scoreboard: _scoreboard }));
  });
}

function findLobby(name: string) {
  return lobbies.find(
    (lobby) => name === lobby.player1?.name || name === lobby.player2?.name
  );
}

function joinLobby(name: string): void {
  const player = players.getPlayer(name);
  if (!player) {
    return;
  }

  for (const i in lobbies) {
    if (Object.prototype.hasOwnProperty.call(lobbies, i)) {
      if (!lobbies[i].player1) {
        lobbies[i].player1 = {
          name,
          avatar: player.avatar,
          guess: null,
        };
        lobbies[i].sendUpdate();
        return;
      }

      if (!lobbies[i].player2) {
        lobbies[i].player2 = {
          name,
          avatar: player.avatar,
          guess: null,
        };
        lobbies[i].sendUpdate();
        return;
      }
    }
  }

  const lobby: Lobby = new Lobby();
  lobby.player1 = {
    name,
    avatar: player.avatar,
    guess: null,
  };
  lobbies.push(lobby);
  lobby.sendUpdate();
}

function leaveLobby(name: string): void {
  const lobbyId = lobbies.findIndex(
    (l) => l.player1?.name === name || l.player2?.name === name
  );
  if (lobbyId === -1) {
    return;
  }

  const lobby = lobbies[lobbyId];

  if (lobby.player1?.name === name) {
    lobbies[lobbyId].player1 = undefined;
  }

  if (lobby.player2?.name === name) {
    lobbies[lobbyId].player2 = undefined;
  }

  if (!lobby.player1 && !lobby.player2) {
    lobbies.splice(lobbyId, 1);
    return;
  }

  lobby.sendUpdate();
}

function closeLobby(lobby: Lobby) {
  const player1 = lobby.player1;
  const player2 = lobby.player2;

  if (player1) {
    leaveLobby(player1.name);
  }

  if (player2) {
    leaveLobby(player2.name);
  }

  if (player1) {
    joinLobby(player1.name);
  }

  if (player2) {
    setTimeout(() => {
      joinLobby(player2.name);
    }, 1000 * 1 + 1000 * 5 * Math.random());
  }
}

function doGuess(name: string, guess: number) {
  const lobby = findLobby(name);
  if (!lobby) {
    return;
  }

  if (lobby.player1?.name === name) {
    lobby.player1.guess = guess;
  }

  if (lobby.player2?.name === name) {
    lobby.player2.guess = guess;
  }

  if (lobby.player1?.guess && lobby.player2?.guess) {
    const player1Diff = Math.abs(lobby.player1.guess - lobby.result);
    const player2Diff = Math.abs(lobby.player2.guess - lobby.result);

    if (player1Diff < player2Diff) {
      players.increasePlayerScore(
        lobby.player1.name,
        player1Diff === 0 ? 3 : 1
      );
    } else if (player2Diff < player1Diff) {
      players.increasePlayerScore(
        lobby.player2.name,
        player2Diff === 0 ? 3 : 1
      );
    }

    setTimeout(() => {
      closeLobby(lobby);
    }, 1000 * 5);
  }

  lobby.sendUpdate();
}

const httpServer = createServer();

const scoreboardIo = new Server(httpServer, {
  path: "/scoreboard/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
scoreboardIo.on("connection", (ws) => {
  boardConnections.push(ws);
  sendScoreboardUpdates();

  ws.on("disconnect", () => {
    boardConnections.splice(boardConnections.indexOf(ws), 1);
  });
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 1000 * 5, // 5 seconds
});
io.on("connection", (ws) => {
  const name = generateName();

  console.log("New connection: '%s'", name);

  players.addPlayer(name, ws);

  ws.on("message", (data: string) => {
    const guess = parseInt(data);
    if (isNaN(guess) || guess < 0 || guess > 100) {
      console.log("Invalid guess: '%d'", guess);
      return;
    }

    console.log("%s guessed: %d", name, data);
    doGuess(name, guess);
  });

  ws.on("disconnect", () => {
    players.removePlayer(name);

    console.log("Connection closed: '%s'", name);
  });
});

httpServer.listen(8080);

console.log("Server started http://localhost:8080");

const lobbyTimeout = 1000 * 60 * 5; // 5 minutes
setInterval(() => {
  lobbies.forEach((lobby) => {
    if (lobby.created.getTime() + lobbyTimeout < Date.now()) {
      console.log(
        "Timeout auto closing lobby (%s vs. %s)",
        lobby.player1?.name,
        lobby.player2?.name
      );
      closeLobby(lobby);
    }
  }, 1000);
});
