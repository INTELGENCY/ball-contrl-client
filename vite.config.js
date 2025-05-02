import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    proxy: {
      "/templates": {
        target: "https://ecommerce.gelatoapis.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/templates/, "/templates"),
        secure: true,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
      "/catalogs": {
        target: "https://product.gelatoapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/catalogs/, "/v3/catalogs"),
        secure: true,
      },
      "/api": {
        target:
          // "http://localhost:3000/",
          "https://ballcontrl.com",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
