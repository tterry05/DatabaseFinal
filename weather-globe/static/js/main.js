/**
 * App entry point.
 * - Initialises the globe
 * - Loads data from real API
 * - Populates stats bar
 */

const REAL_DATA_URL = "/api/weather";

const loadingOverlay  = document.getElementById("loading-overlay");

async function loadData() {
  loadingOverlay.classList.remove("hidden");
  const url = REAL_DATA_URL;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Server returned ${res.status}`);
    Globe.renderDots(data);
    populateStats(data);
  } catch (err) {
    console.error("Failed to load data:", err);
    alert(`Failed to load database data.\n${err.message}`);
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function populateStats(data) {
  if (!data || data.length === 0) return;
  document.getElementById("stat-countries").textContent = data.length;

  const sorted = [...data].sort((a, b) => b.temperature_celsius - a.temperature_celsius);
  const hottest = sorted[0];
  const coldest = sorted[sorted.length - 1];
  const avg = data.reduce((s, d) => s + d.temperature_celsius, 0) / data.length;

  document.getElementById("stat-hottest").textContent =
    `${hottest.country} ${hottest.temperature_celsius.toFixed(1)}°C`;
  document.getElementById("stat-coldest").textContent =
    `${coldest.country} ${coldest.temperature_celsius.toFixed(1)}°C`;
  document.getElementById("stat-avg").textContent = avg.toFixed(1) + "°C";

  const dateStrs = data
    .map(d => d.last_updated ? d.last_updated.split(' ')[0] : null)
    .filter(d => d);

  if (dateStrs.length > 0) {
    dateStrs.sort();
    const minStr = dateStrs[0];
    const maxStr = dateStrs[dateStrs.length - 1];
    document.getElementById("stat-date").textContent = minStr === maxStr ? minStr : `${minStr} to ${maxStr}`;
  } else {
    document.getElementById("stat-date").textContent = "N/A";
  }
}

// Init
(async () => {
  await Globe.loadWorld();
  Globe.init();
  loadData();
})();
