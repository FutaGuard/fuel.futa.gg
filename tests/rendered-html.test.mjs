import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { fuelPrices } from "./fixtures/fuel-prices.mjs";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

function mockPrices(t, records = fuelPrices) {
  t.mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input instanceof Request ? input.url : input);
    assert.equal(url.origin, "https://opendata.futa.gg");
    assert.equal(url.pathname, "/fuel-prices");
    const offset = Number(url.searchParams.get("offset"));
    const limit = Number(url.searchParams.get("limit"));
    return Response.json(records.slice(offset, offset + limit));
  });
}

function section(html, id) {
  const match = html.match(new RegExp(`<section[^>]*aria-labelledby="${id}"[^>]*>([\\s\\S]*?)</section>`));
  assert.ok(match, `Missing section: ${id}`);
  return match[1];
}

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

test("server-renders the fuel dashboard shell", async (t) => {
  mockPrices(t);
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

test("shows the newest domestic week when its crude prices are pending", async (t) => {
  mockPrices(t);
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(section(html, "hero-title"), /32\.67/);
  assert.match(section(html, "hero-title"), /09\/20/);
  assert.match(html, /國內油價資料截至 2026\/09\/26/);
  assert.match(html, /<time dateTime="2026-09-26">2026\/09\/26<\/time>/);
  assert.doesNotMatch(html, /資料已同步|資料同步時間/);

  const crudeCards = section(html, "crude-overview-title");
  assert.equal([...crudeCards.matchAll(/本期尚無資料/g)].length, 3);
  assert.equal([...crudeCards.matchAll(/—<small>USD/g)].length, 3);
  assert.doesNotMatch(crudeCards, /103\.54|120\.47|122\.56|較上週|與上週持平/);
  assert.match(section(html, "crude-trend-title"), /<strong>1<\/strong>/);

  const latestRow = section(html, "history-title").match(/<tbody><tr>([\s\S]*?)<\/tr>/)?.[1];
  assert.ok(latestRow);
  assert.match(latestRow, /2026\/09\/20/);
  assert.match(latestRow, /32\.67/);
  assert.equal([...latestRow.matchAll(/<td>—<\/td>/g)].length, 3);
});

test("renders a crude empty state while keeping domestic charts and history", async (t) => {
  mockPrices(t, fuelPrices.map((record) => ({
    ...record, west_texas: null, dubai: null, brent: null,
  })));
  const html = await (await render()).text();

  assert.match(section(html, "hero-title"), /32\.67/);
  assert.match(section(html, "trend-title"), /class="chart-canvas"/);
  assert.match(section(html, "history-title"), /2026\/09\/20/);
  const crudeChart = section(html, "crude-trend-title");
  assert.match(crudeChart, /<strong>0<\/strong>/);
  assert.match(crudeChart, /這個日期區間尚無原油資料，國內油價仍正常顯示。/);
  assert.doesNotMatch(crudeChart, /class="chart-canvas"/);
});

test("keeps available crude prices including zero without inventing weekly changes", async (t) => {
  mockPrices(t, [{ ...fuelPrices[0], west_texas: 0, brent: -8.86 }]);
  const html = await (await render()).text();
  const crudeCards = section(html, "crude-overview-title");

  assert.match(crudeCards, /0\.00/);
  assert.match(crudeCards, /-8\.86/);
  assert.equal([...crudeCards.matchAll(/本期尚無資料/g)].length, 1);
  assert.equal([...crudeCards.matchAll(/暫無上週資料/g)].length, 2);
  assert.doesNotMatch(crudeCards, /與上週持平/);
});

test("shows an empty state without claiming a data date when the API has no rows", async (t) => {
  mockPrices(t, []);
  const html = await (await render()).text();

  assert.match(html, /目前沒有可顯示的油價資料/);
  assert.doesNotMatch(html, /資料截至|<time/);
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
  assert.match(dashboard, /sync-status-pulse/);
  assert.match(css, /@keyframes sync-status-ping/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(
    dashboard,
    /https:\/\/github\.com\/FutaGuard\/SunsetRollercoaster/,
  );
  assert.match(css, /@plugin "daisyui"/);
  assert.match(packageJson, /"daisyui":/);
  assert.match(packageJson, /"recharts":/);
  assert.match(packageJson, /"build:pages":/);
  assert.match(packageJson, /"check:deployment":/);
  assert.match(packageJson, /"check:mobile-layout":/);
  assert.match(packageJson, /wrangler pages deploy/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(previewRoot));
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
  await access(new URL("public/favicon.svg", templateRoot));
  await access(new URL("../scripts/check-deployed-assets.mjs", import.meta.url));
  await access(new URL("../scripts/check-mobile-layout.mjs", import.meta.url));
});
