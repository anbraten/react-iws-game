import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import "virtual:windi.css";

import Hello from "./hello";
import Game from "./game";
import Aufgabe2 from "./aufgabe2";
import Scoreboard from "./scoreboard";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Hello />} />
      <Route path="/aufgabe2" element={<Aufgabe2 />} />
      <Route path="/game" element={<Game />} />
      <Route path="/scoreboard" element={<Scoreboard />} />
    </Routes>
  </BrowserRouter>
);
