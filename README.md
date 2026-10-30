# CTOS One customer portal, working demo

Open `login.html` in a browser. No build step. Truck sales run through Salesforce: a Quote has one Quote Line per truck configuration, and an accepted line becomes an order on the Trucks tab. Parts, rentals and freight are not Salesforce objects.

- `index.html` – Home
- `fleet.html` – My Fleet (map, vehicle table, telematics)
- `assets/styles.css` – all styling, shared by both pages
- `login.html` – start here; three demo accounts (established customer, brand-new customer, CTOS employee)
- `map.html` – full-screen map · `fleet-manage.html` – add, edit, import and retire units, documents
- `billing.html`, `reports.html`, `team.html` (users and drivers), `support.html`
- `assets/data.js` – the one dataset every page renders from
- `assets/app.js` – rendering, drawers, flows, search, notifications
- `assets/emblem.png` – CTOS "1" emblem
- `assets/config.js` – map provider and API key

Map: open `assets/config.js` and set `MAP_PROVIDER` ('carto', 'google', 'mapbox' or 'osm') and `MAP_API_KEY`. A blank key falls back to OpenStreetMap, which needs none. Keep `config.js` out of version control if it holds a real key.

Keyboard: `[` collapses or expands the navigation. The bell opens notifications; Escape closes it.

Sample data is invented but internally consistent. News photos are free-license Unsplash placeholders (Zoshua Colah, Dextar Studio, Tom Jackson) to be replaced with CTOS photography.

State: approvals, bookings, orders, payments and tickets you make are kept in the browser (localStorage) so every page agrees. "Reset demo data" in the sidebar clears them.
