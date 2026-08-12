import { access } from "node:fs/promises";
import process from "node:process";
import { chromium } from "playwright-core";

const targetUrl = process.argv[2] ?? "https://fuel.futa.gg/";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

let executablePath;
for (const candidate of chromeCandidates) {
  try {
    await access(candidate);
    executablePath = candidate;
    break;
  } catch {
    continue;
  }
}

if (!executablePath) {
  throw new Error("找不到 Chrome；可透過 CHROME_PATH 指定執行檔。");
}

const viewports = [
  { name: "320px", width: 320, height: 568 },
  { name: "iPhone 15 Pro", width: 393, height: 852 },
  { name: "Pixel 8", width: 412, height: 915 },
];

const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
    });

    await page.goto(targetUrl, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });

    const layout = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const selectorFor = (element) => {
        const tag = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : "";
        const classes = [...element.classList]
          .slice(0, 3)
          .map((name) => `.${CSS.escape(name)}`)
          .join("");
        return `${tag}${id}${classes}`;
      };

      const layoutSelectors = [
        ".site-header",
        ".site-main",
        ".site-main > *",
        ".site-footer",
        ".range-toolbar",
        ".range-tabs",
        ".chart-canvas",
        ".recharts-responsive-container",
        ".crude-grid",
        ".table-wrap",
      ];
      const candidates = [
        ...new Set(layoutSelectors.flatMap((selector) => [
          ...document.querySelectorAll(selector),
        ])),
      ];
      const overflow = candidates
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: selectorFor(element),
            left: Math.round(rect.left * 10) / 10,
            right: Math.round(rect.right * 10) / 10,
            width: Math.round(rect.width * 10) / 10,
          };
        })
        .filter(({ left, right, width }) =>
          width > 0 && (left < -0.5 || right > viewportWidth + 0.5),
        );

      return {
        viewportWidth,
        documentWidth: document.documentElement.scrollWidth,
        overflow,
      };
    });

    results.push({ ...viewport, ...layout });
    await page.close();
  }
} finally {
  await browser.close();
}

for (const result of results) {
  console.log(`\n${result.name}: viewport ${result.viewportWidth}px / document ${result.documentWidth}px`);
  console.table(result.overflow.slice(0, 20));
}

const failures = results.filter(
  (result) => result.overflow.length > 0,
);

if (failures.length > 0) {
  console.error(`\n行動版版面檢查失敗：${failures.map((item) => item.name).join("、")}`);
  process.exitCode = 1;
} else {
  console.log("\n行動版版面檢查通過。");
}
