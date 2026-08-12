const target = process.argv[2];

if (!target) {
  console.error("Usage: node scripts/check-deployed-assets.mjs <url>");
  process.exit(2);
}

const baseUrl = new URL(target);
const pageResponse = await fetch(baseUrl, { redirect: "follow" });
const html = await pageResponse.text();
const resourceUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => new URL(match[1], baseUrl))
  .filter((url) => url.origin === baseUrl.origin)
  .map((url) => {
    url.hash = "";
    return url;
  });
const uniqueResourceUrls = [
  ...new Map(resourceUrls.map((url) => [url.href, url])).values(),
];

const resources = await Promise.all(
  uniqueResourceUrls.map(async (url) => {
    try {
      const response = await fetch(url, { redirect: "follow" });
      return {
        path: `${url.pathname}${url.search}`,
        status: response.status,
        contentType: response.headers.get("content-type") ?? "",
      };
    } catch (error) {
      return {
        path: `${url.pathname}${url.search}`,
        status: 0,
        contentType: error instanceof Error ? error.message : String(error),
      };
    }
  }),
);

const expectedContentTypes = new Map([
  [".css", "text/css"],
  [".js", "javascript"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

const failures = resources.filter((resource) => {
  if (resource.status < 200 || resource.status >= 400) return true;
  const extension = [...expectedContentTypes.keys()].find((item) =>
    resource.path.split("?", 1)[0].endsWith(item),
  );
  return extension
    ? !resource.contentType.toLowerCase().includes(expectedContentTypes.get(extension))
    : false;
});

console.table(resources);
console.log(
  JSON.stringify(
    {
      url: baseUrl.href,
      pageStatus: pageResponse.status,
      resourceCount: resources.length,
      failures,
    },
    null,
    2,
  ),
);

if (!pageResponse.ok || failures.length > 0) process.exit(1);
