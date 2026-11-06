#!/usr/bin/env node
// Static checks for the Pages site. Node built-ins only.
// Usage: node scripts/check-site.mjs [siteDir]   (default: site)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const VOID = new Set(["meta", "link", "br", "hr", "img", "input", "source", "area", "base", "col", "wbr", "path", "circle", "rect", "line", "stop", "polygon", "polyline", "ellipse"]);
const RAW = new Set(["script", "style"]);

export function checkSite(dir) {
  const errors = [];
  let krChecks = 0;
  const rates = JSON.parse(readFileSync(join(dir, "rates.json"), "utf8"));
  const rate = rates.usdIsk;
  const vat = rates.vskRate;
  const files = readdirSync(dir).filter((f) => f.endsWith(".html")).sort();
  const pages = new Map();
  for (const f of files) pages.set(f, readFileSync(join(dir, f), "utf8"));

  const ids = new Map();
  for (const [f, html] of pages) {
    ids.set(f, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }

  const usd = (s) => Number(s.replace(/\./g, ""));
  const kr = (s) => Number(s.replace(/\./g, ""));
  const text = (html) =>
    html.replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ");

  for (const [f, html] of pages) {
    const err = (msg) => errors.push(`${f}: ${msg}`);

    // 1. well-formedness: balanced tags
    const stack = [];
    const tagRe = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
    let m;
    let rawUntil = null;
    while ((m = tagRe.exec(html))) {
      if (m[0].startsWith("<!--")) continue;
      const [, close, nameRaw, , self] = m;
      const name = nameRaw.toLowerCase();
      if (rawUntil) {
        if (close && name === rawUntil) rawUntil = null;
        else continue;
      }
      if (!close && RAW.has(name)) { rawUntil = name; stack.push(name); continue; }
      if (VOID.has(name) || self) continue;
      if (!close) { stack.push(name); continue; }
      const top = stack.pop();
      if (top !== name) { err(`mismatched </${name}> (open: <${top}>) near offset ${m.index}`); break; }
    }
    if (stack.length && !errors.some((e) => e.startsWith(f + ": mismatched"))) err(`unclosed <${stack.at(-1)}>`);

    // 2. internal links and anchors
    for (const h of html.matchAll(/\shref="([^"]*)"/g)) {
      const href = h[1];
      if (/^(https?:|mailto:|tel:)/.test(href) || href === "") continue;
      const [path, frag] = href.split("#");
      const target = path === "" ? f : path === "./" || path === "/" ? "index.html" : path;
      if (!pages.has(target)) { err(`broken link ${href} (no such page)`); continue; }
      if (frag && !ids.get(target).has(frag)) err(`broken anchor ${href}`);
    }

    // 3. kr derived from one declared rate
    for (const r of html.matchAll(/>\$([\d.]+)<\/strong><\/td><td>([\d.]+) kr</g)) {
      krChecks++;
      const want = Math.round(usd(r[1]) * rate);
      if (kr(r[2]) !== want) err(`$${r[1]} should be ${want} kr at ${rate}, found ${r[2]} kr`);
    }
    for (const r of html.matchAll(/<strong>([\d.]+) kr<\/strong><\/td><td>\$([\d.]+)<\/td><td><strong>\$([\d.]+)</g)) {
      krChecks++;
      const n = kr(r[1]);
      const a = Math.round(n / rate);
      const b = Math.round(n / vat / rate);
      if (usd(r[2]) !== a) err(`${r[1]} kr should be $${a} at ${rate}, found $${r[2]}`);
      if (usd(r[3]) !== b) err(`${r[1]} kr ex VAT should be $${b} at ${rate}, found $${r[3]}`);
    }
    // ranges: price-usd line followed by price-isk line (~x-y kr, rounded to hundreds)
    const lines = html.split("\n");
    lines.forEach((ln, i) => {
      const u = ln.match(/class="price-usd">\$([\d.]+)(?:[–-]\$([\d.]+))?/);
      if (!u) return;
      const next = lines.slice(i + 1, i + 4).join("\n").match(/class="price-isk">~([\d.]+)(?:[–-]([\d.]+))? kr/);
      if (!next) return;
      const pairs = [[u[1], next[1]], [u[2] ?? u[1], next[2] ?? next[1]]];
      krChecks++;
      for (const [d, k] of pairs) {
        const want = usd(d) * rate;
        if (Math.abs(kr(k) - want) / want > 0.01) err(`line ${i + 1}: $${d} is about ${Math.round(want)} kr at ${rate}, found ~${k} kr`);
      }
    });
    for (const r of html.matchAll(/eða (\d+),(\d+) kr/g)) {
      if (Number(`${r[1]}.${r[2]}`) !== rate) err(`quoted rate ${r[1]},${r[2]} differs from rates.json ${rate}`);
    }

    // 4. as-of banner agrees with rates.json
    const b = html.match(/class="as-of-banner" data-as-of="([^"]+)"/);
    if (!b) err("missing as-of banner");
    else if (b[1] !== rates.asOf) err(`as-of banner ${b[1]} differs from rates.json ${rates.asOf}`);

    // 5. no thankastrik (em dash) in visible text
    if (text(html).includes("—")) err("em dash (thankastrik) in text");
  }
  if (krChecks === 0) errors.push("no kr amounts were checked (extractor matched nothing)");
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const dir = process.argv[2] ?? "site";
  if (!existsSync(dir)) { console.error(`no such directory: ${dir}`); process.exit(2); }
  const errors = checkSite(dir);
  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
  console.log(`check-site: ${dir} ok`);
}
