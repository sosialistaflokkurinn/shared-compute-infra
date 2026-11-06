# Shared Compute Purchasing Guide (`shared-compute-infra`)

Purchasing guide for the party's shared Mac Studio and developer test phones, published as public Icelandic pages. It compares the US and Icelandic secondhand markets for used Apple Silicon Macs (Mac mini / Mac Studio), an iPhone and a Pixel:

- **Studio Mac specification:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/](https://sosialistaflokkurinn.github.io/shared-compute-infra/)
- **Developer iPhone, Pixel & 32 GB Mac specification:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/andri.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/andri.html)
- **Used Macs on the market (32 GB or more, US and Iceland):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/markadur.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/markadur.html)
- **Used phones on the market (iPhone and Pixel):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/simar.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/simar.html)
- **Development flow and connections (laptop, Mac, phones):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/dev-flow.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/dev-flow.html)
- **Dimensions, weights and shipping:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/shipping.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/shipping.html)

The pages are static HTML in `site/`. `.github/workflows/pages.yml` deploys them to GitHub Pages on every push to `main` that touches `site/`.

## Checks

`node scripts/check-site.mjs` validates the pages (tag balance, internal links and anchors, kr amounts recomputed from the single rate in `site/rates.json`, as-of banner, no em dash in text). `node --test test/check-site.test.mjs` runs it against fixtures. CI runs both on pull requests.
