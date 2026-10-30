// CTOS One mockup configuration.
// This file is loaded by fleet.html. Keep it out of version control if it holds a real key.
//
// MAP_PROVIDER: 'carto' | 'google' | 'mapbox' | 'osm'
//   carto  – CARTO vector basemap through MapLibre, repainted in the portal's style (the one to use). Free key at https://carto.com/basemaps/apikey.
//   google – Maps JavaScript API key from Google Cloud console.
//   mapbox – Public access token from mapbox.com.
//   osm    – Esri Light Gray Canvas, no key (fallback, zoom to 16).
// MAP_API_KEY: paste the key between the quotes. Leave blank to fall back to the keyless map.
//
// Restrict the key to your domain (or localhost while testing) in the provider's console.

window.CTOS_CONFIG = {
  MAP_PROVIDER: 'carto',
  MAP_API_KEY:  ''
};
