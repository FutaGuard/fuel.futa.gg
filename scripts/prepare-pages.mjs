import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const clientDirectory = resolve(root, "dist/client");
const serverDirectory = resolve(root, "dist/server");
const pagesDirectory = resolve(root, ".pages-dist");
const workerDirectory = resolve(pagesDirectory, "_worker.js");
const workerServerDirectory = resolve(workerDirectory, "server");
const redirectedWranglerConfig = resolve(root, ".wrangler/deploy/config.json");

await rm(pagesDirectory, { recursive: true, force: true });
await mkdir(pagesDirectory, { recursive: true });
await cp(clientDirectory, pagesDirectory, { recursive: true });
await mkdir(workerDirectory, { recursive: true });
await cp(serverDirectory, workerServerDirectory, { recursive: true });
await rm(resolve(workerServerDirectory, "wrangler.json"), { force: true });
await writeFile(
  resolve(workerDirectory, "index.js"),
  `import application from "./server/index.js";

export default {
  fetch(request, env, context) {
    const pathname = new URL(request.url).pathname;

    if (pathname.startsWith("/_next/static/")) {
      return env.ASSETS.fetch(request);
    }

    return application.fetch(request, env, context);
  },
};
`,
);
await rm(redirectedWranglerConfig, { force: true });

console.log(`Cloudflare Pages output prepared at ${pagesDirectory}`);
