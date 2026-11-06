# Shared compute: in use today, and what to buy (`shared-compute-infra`)

The party's shared developer compute, published as public Icelandic pages: what runs today (a rented Mac mini, GCP Cloud Run runners, the developer laptop, a test phone) and the purchasing guide for an owned Mac and test phones, comparing the US and Icelandic secondhand markets for used Apple Silicon Macs (Mac mini / Mac Studio), an iPhone and a Pixel:

- **In use today (machines, CI runner lanes, cost):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/i-notkun.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/i-notkun.html)
- **Studio Mac specification:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/](https://sosialistaflokkurinn.github.io/shared-compute-infra/)
- **Developer iPhone, Pixel & 32 GB Mac specification:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/andri.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/andri.html)
- **Used Macs on the market (32 GB or more, US and Iceland):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/markadur.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/markadur.html)
- **Used phones on the market (iPhone and Pixel):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/simar.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/simar.html)
- **Development flow and connections (laptop, Mac, phones):** [https://sosialistaflokkurinn.github.io/shared-compute-infra/dev-flow.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/dev-flow.html)
- **Dimensions, weights and shipping:** [https://sosialistaflokkurinn.github.io/shared-compute-infra/shipping.html](https://sosialistaflokkurinn.github.io/shared-compute-infra/shipping.html)

The pages are static HTML in `site/`. `.github/workflows/pages.yml` deploys them to GitHub Pages on every push to `main` that touches `site/`.

## Checks

`node scripts/check-site.mjs` validates the pages (tag balance, internal links and anchors, kr amounts recomputed from the single rate in `site/rates.json`, as-of banner, no em dash in text). `node --test test/check-site.test.mjs` runs it against fixtures. CI runs both on pull requests.
