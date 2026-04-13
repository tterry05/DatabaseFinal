/**
 * App entry point.
 * - Initialises the globe
 * - Loads data (fake or real based on toggle)
 * - Wires up the toggle switch
 * - Populates stats bar
 */

const FAKE_DATA_URL = "/static/data/weather_fake.json";
const REAL_DATA_URL = "/api/weather";

const loadingOverlay  = document.getElementById("loading-overlay");
const toggleInput     = document.getElementById("data-toggle");
const statusText      = document.getElementById("toggle-status-text");
const labelFake       = document.getElementById("label-fake");
const labelReal       = document.getElementById("label-real");

async function loadData(useReal) {
  loadingOverlay.classList.remove("hidden");
  const url = useReal ? REAL_DATA_URL : FAKE_DATA_URL;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    Globe.renderDots(data);
    populateStats(data);
  } catch (err) {
    console.error("Failed to load data:", err);
    alert(`Failed to load ${useReal ? "database" : "demo"} data.\n${err.message}`);
  } finally {
    loadingOverlay.classList.add("hidden");
  }
}

function populateStats(data) {
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
}

toggleInput.addEventListener("change", () => {
  const useReal = toggleInput.checked;
  statusText.textContent = useReal ? "Live DB" : "Demo Data";
  labelFake.classList.toggle("active", !useReal);
  labelReal.classList.toggle("active", useReal);
  loadData(useReal);
});

// Init
(async () => {
  await Globe.loadWorld();
  Globe.init();
  loadData(false); // Start with fake data by default
  labelFake.classList.add("active");
})();