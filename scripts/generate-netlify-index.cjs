const fs = require("fs");
const path = require("path");

function generate() {
  const publicDir = path.join(process.cwd(), ".output", "public");
  const assetsDir = path.join(publicDir, "assets");
  if (!fs.existsSync(assetsDir)) {
    console.error("No assets directory found at", assetsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir);
  const css = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
  const serverBrowser = files.find((f) => f.startsWith("server.browser-") && f.endsWith(".js"));
  const indexScripts = files.filter((f) => /^index-.*\.js$/.test(f));

  const html = [];
  html.push("<!doctype html>");
  html.push('<html lang="en">');
  html.push("<head>");
  html.push('  <meta charset="utf-8" />');
  html.push('  <meta name="viewport" content="width=device-width,initial-scale=1" />');
  html.push("  <title>Mark to PDF</title>");
  if (css) html.push(`  <link rel="stylesheet" href="/assets/${css}">`);
  html.push("</head>");
  html.push("<body>");
  html.push('  <div id="root"></div>');
  if (serverBrowser) html.push(`  <script type="module" src="/assets/${serverBrowser}"></script>`);
  for (const s of indexScripts) html.push(`  <script type="module" src="/assets/${s}"></script>`);
  html.push("</body>");
  html.push("</html>");

  fs.writeFileSync(path.join(publicDir, "index.html"), html.join("\n"));
  console.log("Generated", path.join(publicDir, "index.html"));
}

generate();
