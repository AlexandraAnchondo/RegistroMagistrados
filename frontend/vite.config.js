import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from "fs"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 8080,
    allowedHosts: ["c80806a9e8b9.ngrok-free.app"],
  },
});