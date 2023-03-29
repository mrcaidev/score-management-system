import react from "@vitejs/plugin-react-swc";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), unocss(), tsconfigPaths()],
});
