# Collectible marketplace interface suite

Two production-oriented front-end prototypes using the supplied CollectiAgent branding.

## Interfaces

- `collecti-agent/index.html` — discovery missions, recent searches, saved monitoring, reruns, exports, category activity, market overview, and live CollectiAgent API integration.
- `market-analyzer/index.html` — free-form market analysis, value ranges, confidence, price visualization, sales and listings, category browsing, local watchlist, three-item comparison, and report exports.

## Local preview

Run this command in the package directory:

```sh
python3 -m http.server 4188
```

Then open:

- `http://127.0.0.1:4188/collecti-agent/`
- `http://127.0.0.1:4188/market-analyzer/`

## API deployment

Each page automatically uses relative API URLs when hosted on its intended Replit domain. On other domains it uses the remote origin configured in the `<html data-api-base="…">` attribute.

For reliable production operation, deploy each page into its corresponding Replit application so API requests are same-origin. If using another domain, configure the backend to permit that exact origin and credentialed requests.

### CollectiAgent API integration

The discovery interface uses the existing search, statistics, save, run, and run-now endpoints. Created searches can be opened in the original result-detail workspace.

### CollectiMarketAnalyzer API integration

The analyzer uses the existing free-form analysis, categories, and category-item endpoints. Watchlist and comparison data are stored locally in the browser and do not require new server tables.

These interfaces do not fabricate marketplace results. Empty and connection states are intentionally shown when a backend cannot be reached.

## Cloudflare Pages deployment

The Cloudflare-hosted version needs the included Pages Functions because browser requests cannot reliably call the two Replit APIs directly across origins.

The functions expose two same-origin proxy prefixes:

- `/api/agent/*` → `https://collecti-agent.replit.app/api/*`
- `/api/market/*` → `https://bay-trends.replit.app/api/*`

The front-end applications are already configured to use these prefixes whenever they are not running on their original Replit domains.

### Recommended: deploy with Wrangler

From the `collecti-marketplace-suite` directory:

```sh
npx wrangler login
npx wrangler pages deploy . --project-name=YOUR_CLOUDFLARE_PAGES_PROJECT
```

The `functions` directory must be beside the static files when the Wrangler command runs. The included `_routes.json` limits Function invocations to the two API prefixes; HTML, CSS, JavaScript, and images remain ordinary static assets.

Cloudflare dashboard drag-and-drop does not compile a `functions` directory. If the existing deployment was made by dragging a folder or ZIP into the dashboard, redeploy with Wrangler or connect the project to a Git repository.

### Verify after deployment

Open these URLs on the deployed domain:

```text
https://YOUR-DOMAIN/api/agent/searches/stats
https://YOUR-DOMAIN/api/market/categories
```

Both should return an API response instead of the site's HTML or a Cloudflare 404 page. Then open the two application pages and confirm their header status changes to live/ready.

Use **Workers & Pages → your project → Functions → Logs** to inspect proxy failures. A `502` response means the corresponding Replit service could not be reached or returned a network failure.
