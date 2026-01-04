import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "terser", // 👈 مهم جدًا
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
