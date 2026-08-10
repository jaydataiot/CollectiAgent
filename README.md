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
