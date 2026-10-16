import { createServer } from "/Users/dylan/code/projects/blog/node_modules/vite/dist/node/index.js";
const server = await createServer({
  root: "/Users/dylan/code/projects/blog",
  configFile: "/Users/dylan/code/projects/blog/vite.config.ts",
  server: { port: Number(process.env.PORT ?? 5298), strictPort: true, hmr: false, watch: { ignored: ["**/*"] } },
});
await server.listen();
console.log("listening", process.env.PORT ?? 5298);
