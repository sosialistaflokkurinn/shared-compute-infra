# shared-compute-infra

Purchasing guide for the party's shared Mac Studio and developer test phones. Static Icelandic pages in `site/`, published on GitHub Pages: https://sosialistaflokkurinn.github.io/shared-compute-infra/. The repo is public: no credentials, no internal URLs.

## Policy the pages encode

- 32 GB is the minimum RAM for the shared Mac (`site/index.html`, "algjört lágmark"); never recommend 8 or 16 GB.
- Mac Studio comes first, Mac mini second.
- USPS IMM 135.62 bans mailing used phones with lithium batteries internationally; `site/shipping.html` explains it and the phone recommendations must stay consistent with it.

## Prices and the exchange rate

- ONE rate lives in `site/rates.json` (`usdIsk`, `asOf`, `vskRate`). Every kr amount derived from a USD price is `USD x usdIsk` (Epli rows: kr / rate, and / 1.24 for ex-VAT).
- When the rate or a price changes: update `rates.json`, recompute the kr figures, update the quoted rate text ("eða 122,79 kr") and the `as-of-banner` date on every page, then run `node scripts/check-site.mjs` until it passes.
- Refresh the listings (Swappa, Craigslist, Epli) on the `blocked: time` issue's Revisit date.

## Rules

- UI text is Icelandic (short, plain). Code, commits, PRs, issues and docs are English.
- No em dash (the thankastrik) in page text; the check fails on it.
- Preview: `xdg-open site/index.html`. Checks: `node scripts/check-site.mjs` and `node --test test/check-site.test.mjs` (also run on pull requests).
- Deploy: a push to `main` touching `site/**` runs `.github/workflows/pages.yml`. A merge to `site/**` is a live publish; flag it before merging.
- Add a page: link it in the nav of every page and in the README list.
