import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5080,
    allowedHosts: ['i12a508.p.ssafy.io']
  },
  base: '/'
});