import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  // Keep peers/runtime deps external — consumers provide these.
  external: ["react", "react-dom", "lottie-web"],
});
