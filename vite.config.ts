import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1800,
    open: true,
  },
  resolve: {
    alias: [
      {
        find: /^components$/,
        replacement: path.resolve(__dirname, "src/components/index.ts"),
      },
      {
        find: /^pages$/,
        replacement: path.resolve(__dirname, "src/pages/index.ts"),
      },
      {
        find: /^utils$/,
        replacement: path.resolve(__dirname, "src/utils/index.ts"),
      },
    ],
  },
})