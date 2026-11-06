import { test } from "node:test";
import assert from "node:assert/strict";
import { checkSite } from "../scripts/check-site.mjs";

const fx = (n) => new URL(`./fixtures/${n}`, import.meta.url).pathname;

test("good fixture passes", () => assert.deepEqual(checkSite(fx("good")), []));
test("broken link is reported", () => {
  const e = checkSite(fx("broken-link"));
  assert.ok(e.some((x) => x.includes("broken link missing.html")), e.join("\n"));
});
test("kr that disagrees with the declared rate is reported", () => {
  const e = checkSite(fx("wrong-kr"));
  assert.ok(e.some((x) => x.includes("should be 1000 kr")), e.join("\n"));
});
test("the real site passes", () => assert.deepEqual(checkSite(new URL("../site", import.meta.url).pathname), []));
