import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
  plugins: [react(), WindiCSS()],
  build: {
    minify: false,
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/socket.io": {
        target: "http://localhost:8080",
        ws: true,
      },
      "/scoreboard/socket.io": {
        target: "http://localhost:8080",
        ws: true,
      },
    },
  },
});
