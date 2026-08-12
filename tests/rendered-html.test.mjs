import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the fuel dashboard shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>台灣油價歷史趨勢 · fuel\.futa\.gg<\/title>/i);
  assert.match(html, /台灣/);
  assert.match(html, /油價/);
  assert.match(html, /fuel\.futa\.gg/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("includes extended and custom time-range controls", async () => {
  const [dashboard, page, css, packageJson] = await Promise.all([
    readFile(new URL("../app/FuelDashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const label of ["3 個月", "6 個月", "1 年", "3 年", "5 年", "10 年", "全部", "自訂"]) {
    assert.match(dashboard, new RegExp(label));
  }
  assert.match(dashboard, /type="date"/);
  assert.match(dashboard, /套用區間/);
  assert.match(dashboard, /aria-pressed/);
  for (const label of ["西德州原油", "杜拜原油", "布蘭特原油", "原油價格走勢"]) {
    assert.match(dashboard, new RegExp(label));
  }
  for (const field of ["west_texas", "dubai", "brent"]) {
    assert.match(page, new RegExp(field));
  }
  assert.match(dashboard, /type="monotone"/);
  assert.doesNotMatch(dashboard, /type="stepAfter"/);
  assert.match(css, /@plugin "daisyui"/);
  assert.match(packageJson, /"daisyui":/);
  assert.match(packageJson, /"recharts":/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(previewRoot));
  await access(new URL("public/favicon.svg", templateRoot));
});
