import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv';

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "/",
  // server: {
  //   host: '0.0.0.0',
  //   port: 5173,
  //   open: true,
  // },
})
