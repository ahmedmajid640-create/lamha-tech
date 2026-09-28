// Submits every URL in the production sitemap to IndexNow (Bing, Yandex, Seznam, Naver share the index).
// Usage: npm run seo:indexnow            (reads the key from scripts/.indexnow-key; the matching
//        public/<key>.txt must be deployed so the search engines can verify ownership)
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const key = (process.env.INDEXNOW_KEY ?? readFileSync(path.join(here, ".indexnow-key"), "utf8")).trim();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lamhatechnologies.com").replace(/\/$/, "");
const host = new URL(siteUrl).host;

const xml = await (await fetch(`${siteUrl}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error("No URLs found in sitemap");

const keyCheck = await fetch(`${siteUrl}/${key}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) throw new Error(`Key file ${siteUrl}/${key}.txt is not served correctly`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `${siteUrl}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: submitted ${urls.length} URLs for ${host} -> HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
