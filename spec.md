# 🌍 Global Weather Globe — Full Project Specification
### AI Agent Implementation Guide (End-to-End)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Repository Structure](#3-repository-structure)
4. [Data Layer](#4-data-layer)
   - 4a. Fake Data (Static JSON)
   - 4b. Real Data (PostgreSQL via Flask)
5. [Backend — Flask Application](#5-backend--flask-application)
6. [Frontend — D3.js Globe](#6-frontend--d3js-globe)
7. [Fake/Real Data Toggle](#7-fakereal-data-toggle)
8. [Tooltip System](#8-tooltip-system)
9. [Visual Design Spec](#9-visual-design-spec)
10. [Complete File Contents](#10-complete-file-contents)
11. [Setup & Run Instructions](#11-setup--run-instructions)
12. [Agent Execution Checklist](#12-agent-execution-checklist)

---

## 1. Project Overview

Build a full-stack data visualization web application that renders an **interactive, rotatable 3D globe** using D3.js. Each country is represented by a dot plotted at its capital city's coordinates. Dots are **colored on a red-to-blue temperature gradient** (red = hot, blue = cold). Hovering or clicking a dot opens a **full data tooltip** showing every field from the weather dataset.

A **toggle switch in the UI** lets the user switch between:
- **Fake mode** — uses a bundled static JSON file (works offline, no database needed)
- **Real mode** — fetches live data from a Flask API backed by PostgreSQL

The application must run entirely from a single project folder with one command (`flask run` or `python app.py`).

---

## 2. Tech Stack & Dependencies

### Backend
| Package | Version | Purpose |
|---|---|---|
| Python | 3.9+ | Runtime |
| Flask | 3.x | Web server & API |
| psycopg2-binary | 2.9+ | PostgreSQL adapter |
| python-dotenv | 1.x | `.env` config loading |

### Frontend (CDN — no npm/build step)
| Library | CDN URL | Purpose |
|---|---|---|
| D3.js v7 | `https://cdn.jsdelivr.net/npm/d3@7` | Globe, scales, projections |
| TopoJSON v3 | `https://cdn.jsdelivr.net/npm/topojson@3` | World land/border geometry |

### Install backend deps:
```bash
pip install flask psycopg2-binary python-dotenv
```

---

## 3. Repository Structure

```
weather-globe/
├── app.py                  # Flask application entry point
├── db.py                   # Database connection + query helpers
├── .env                    # DB credentials (never commit this)
├── .env.example            # Template for .env
├── requirements.txt        # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   ├── globe.js        # D3 globe rendering engine
│   │   ├── tooltip.js      # Tooltip build + position logic
│   │   ├── colorScale.js   # Temperature → color mapping
│   │   └── main.js         # App init, data fetch, toggle wiring
│   └── data/
│       └── weather_fake.json  # Static fake dataset (all countries)
└── templates/
    └── index.html          # Single HTML page
```

---

## 4. Data Layer

### 4a. Fake Data — `static/data/weather_fake.json`

This file must be a **JSON array** of objects. Each object has **exactly** these fields (matching the real DB schema):

```json
[
  {
    "country": "Albania",
    "location_name": "Tirana",
    "latitude": 41.3275,
    "longitude": 19.8189,
    "timezone": "Europe/Tirane",
    "last_updated": "2025-03-15 10:45:00",
    "temperature_celsius": 25.4,
    "temperature_fahrenheit": 77.7,
    "condition_text": "Partly cloudy",
    "wind_mph": 14.8,
    "wind_kph": 23.8,
    "wind_degree": 161,
    "wind_direction": "SSE",
    "pressure_mb": 1011.0,
    "pressure_in": 29.85,
    "precip_mm": 0.0,
    "precip_in": 0.0,
    "humidity": 26,
    "cloud": 75,
    "feels_like_celsius": 25.5,
    "feels_like_fahrenheit": 77.8,
    "visibility_km": 10.0,
    "visibility_miles": 6.0,
    "uv_index": 2.2,
    "gust_mph": 20.6,
    "gust_kph": 33.1,
    "air_quality_Carbon_Monoxide": 233.1,
    "air_quality_Ozone": 87.0,
    "air_quality_Nitrogen_dioxide": 4.625,
    "air_quality_Sulphur_dioxide": 2.22,
    "air_quality_PM2_5": 18.5,
    "air_quality_PM10": 54.39,
    "air_quality_us_epa_index": 2,
    "air_quality_gb_defra_index": 2,
    "sunrise": "05:53 AM",
    "sunset": "05:48 PM",
    "moonrise": "07:08 PM",
    "moonset": "06:16 AM",
    "moon_phase": "Waning Gibbous",
    "moon_illumination": 100
  }
]
```

**The fake dataset must include at least 60 countries** spread across all continents and a wide temperature range (from ~-30°C to ~45°C) so the color gradient is visually meaningful. Generate plausible but not necessarily accurate values for countries not in the real sample. Ensure coverage of:
- Africa (10+ countries)
- Asia (15+ countries)
- Europe (15+ countries)
- North America (5+ countries)
- South America (8+ countries)
- Oceania (4+ countries)
- Antarctica / polar (at least 1 very cold entry, e.g. -30°C)

### 4b. Real Data — PostgreSQL

The database is named **`marigold`**, schema **`weather`**. The agent must assume the table is named **`weather`** within that schema (i.e., `weather.weather`). Adjust the query if the professor names it differently — the column names match the JSON fields above exactly (with dot notation replacing special chars like `"air_quality_PM2.5"` → column name `air_quality_PM2.5` in postgres, aliased in query).

#### SQL Query (in `db.py`):

```sql
SELECT
    country,
    location_name,
    latitude,
    longitude,
    timezone,
    last_updated,
    temperature_celsius,
    temperature_fahrenheit,
    condition_text,
    wind_mph,
    wind_kph,
    wind_degree,
    wind_direction,
    pressure_mb,
    pressure_in,
    precip_mm,
    precip_in,
    humidity,
    cloud,
    feels_like_celsius,
    feels_like_fahrenheit,
    visibility_km,
    visibility_miles,
    uv_index,
    gust_mph,
    gust_kph,
    "air_quality_Carbon_Monoxide"  AS air_quality_Carbon_Monoxide,
    "air_quality_Ozone"            AS air_quality_Ozone,
    "air_quality_Nitrogen_dioxide" AS air_quality_Nitrogen_dioxide,
    "air_quality_Sulphur_dioxide"  AS air_quality_Sulphur_dioxide,
    "air_quality_PM2.5"            AS air_quality_PM2_5,
    "air_quality_PM10"             AS air_quality_PM10,
    "air_quality_us-epa-index"     AS air_quality_us_epa_index,
    "air_quality_gb-defra-index"   AS air_quality_gb_defra_index,
    sunrise,
    sunset,
    moonrise,
    moonset,
    moon_phase,
    moon_illumination
FROM weather.weather;
```

> **Note to agent:** The column names in the DB may use dots and dashes (e.g. `"air_quality_PM2.5"`, `"air_quality_us-epa-index"`). Always double-quote these in SQL. The aliases normalize them to underscore-safe names for JSON serialization.

---

## 5. Backend — Flask Application

### `app.py` — Complete Implementation

```python
from flask import Flask, jsonify, render_template
from db import get_weather_data
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/weather")
def weather():
    """Returns all weather rows as JSON array from PostgreSQL."""
    try:
        data = get_weather_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

### `db.py` — Complete Implementation

```python
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "marigold"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "")
    )

def get_weather_data():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT
            country,
            location_name,
            latitude,
            longitude,
            timezone,
            last_updated,
            temperature_celsius,
            temperature_fahrenheit,
            condition_text,
            wind_mph,
            wind_kph,
            wind_degree,
            wind_direction,
            pressure_mb,
            pressure_in,
            precip_mm,
            precip_in,
            humidity,
            cloud,
            feels_like_celsius,
            feels_like_fahrenheit,
            visibility_km,
            visibility_miles,
            uv_index,
            gust_mph,
            gust_kph,
            "air_quality_Carbon_Monoxide"  AS air_quality_Carbon_Monoxide,
            "air_quality_Ozone"            AS air_quality_Ozone,
            "air_quality_Nitrogen_dioxide" AS air_quality_Nitrogen_dioxide,
            "air_quality_Sulphur_dioxide"  AS air_quality_Sulphur_dioxide,
            "air_quality_PM2.5"            AS air_quality_PM2_5,
            "air_quality_PM10"             AS air_quality_PM10,
            "air_quality_us-epa-index"     AS air_quality_us_epa_index,
            "air_quality_gb-defra-index"   AS air_quality_gb_defra_index,
            sunrise,
            sunset,
            moonrise,
            moonset,
            moon_phase,
            moon_illumination
        FROM weather.weather;
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    # Convert RealDictRow to plain dict, cast Decimal/datetime to serializable types
    result = []
    for row in rows:
        d = dict(row)
        for k, v in d.items():
            if hasattr(v, 'isoformat'):
                d[k] = str(v)
            elif hasattr(v, '__float__'):
                d[k] = float(v)
        result.append(d)
    return result
```

### `.env.example`

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marigold
DB_USER=postgres
DB_PASSWORD=yourpassword
```

### `requirements.txt`

```
flask>=3.0.0
psycopg2-binary>=2.9.0
python-dotenv>=1.0.0
```

---

## 6. Frontend — D3.js Globe

### `templates/index.html`

Full HTML shell. All scripts loaded from CDN + static files. No build step.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Global Weather Globe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/css/style.css" />
</head>
<body>
  <div id="app">
    <header id="header">
      <div id="header-left">
        <h1 id="title">WORLD<br/>WEATHER</h1>
        <p id="subtitle">Atmospheric snapshot · March 2025</p>
      </div>
      <div id="header-right">
        <div id="data-toggle-wrap">
          <span class="toggle-label" id="label-fake">DEMO</span>
          <label class="toggle-switch" for="data-toggle">
            <input type="checkbox" id="data-toggle" />
            <span class="toggle-track">
              <span class="toggle-thumb"></span>
            </span>
          </label>
          <span class="toggle-label" id="label-real">LIVE DB</span>
        </div>
        <div id="toggle-status">Using: <strong id="toggle-status-text">Demo Data</strong></div>
      </div>
    </header>

    <div id="legend">
      <span class="legend-label">−30°C</span>
      <div id="legend-gradient"></div>
      <span class="legend-label">+50°C</span>
      <span id="legend-title">Surface Temperature</span>
    </div>

    <div id="globe-container">
      <svg id="globe-svg"></svg>
      <div id="loading-overlay">
        <div id="loading-spinner"></div>
        <p id="loading-text">Loading weather data…</p>
      </div>
    </div>

    <div id="tooltip" class="hidden"></div>

    <div id="stats-bar">
      <div class="stat-item"><span class="stat-val" id="stat-countries">—</span><span class="stat-label">Countries</span></div>
      <div class="stat-item"><span class="stat-val" id="stat-hottest">—</span><span class="stat-label">Hottest</span></div>
      <div class="stat-item"><span class="stat-val" id="stat-coldest">—</span><span class="stat-label">Coldest</span></div>
      <div class="stat-item"><span class="stat-val" id="stat-avg">—</span><span class="stat-label">Avg Temp</span></div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script src="https://cdn.jsdelivr.net/npm/topojson@3"></script>
  <script src="/static/js/colorScale.js"></script>
  <script src="/static/js/tooltip.js"></script>
  <script src="/static/js/globe.js"></script>
  <script src="/static/js/main.js"></script>
</body>
</html>
```

---

### `static/css/style.css` — Complete Styles

Design aesthetic: **dark space / deep navy** background. The globe sits in the center like a star. UI elements use a cold monospaced font (`Space Mono`) for data labels, and a clean humanist font (`DM Sans`) for readable body text. Color palette: near-black navy `#050d1a`, electric cyan accent `#00d4ff`, muted steel `#8899bb`. No gradients on UI chrome — stark, clean, scientific.

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:         #050d1a;
  --surface:    #0a1628;
  --border:     #1a2e4a;
  --cyan:       #00d4ff;
  --cyan-dim:   #0099bb;
  --text:       #ccd6f6;
  --text-muted: #5a7299;
  --mono:       'Space Mono', monospace;
  --sans:       'DM Sans', sans-serif;
  --dot-size:   7px;
  --transition: 0.25s ease;
}

html, body {
  width: 100%; height: 100%; overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

#app {
  width: 100vw; height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "globe"
    "stats";
  position: relative;
}

/* ── HEADER ─────────────────────────────── */
#header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 36px 12px;
  border-bottom: 1px solid var(--border);
  z-index: 10;
}

#title {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.08em;
  color: #fff;
}

#subtitle {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.12em;
  margin-top: 6px;
  text-transform: uppercase;
}

#header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* ── TOGGLE ─────────────────────────────── */
#data-toggle-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  transition: color var(--transition);
}

#label-real.active { color: var(--cyan); }
#label-fake.active { color: var(--cyan); }

.toggle-switch { cursor: pointer; }
.toggle-switch input { display: none; }

.toggle-track {
  display: block;
  width: 48px; height: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  position: relative;
  transition: border-color var(--transition);
}

.toggle-switch input:checked + .toggle-track {
  border-color: var(--cyan);
}

.toggle-thumb {
  display: block;
  width: 18px; height: 18px;
  background: var(--text-muted);
  border-radius: 50%;
  position: absolute;
  top: 2px; left: 2px;
  transition: transform var(--transition), background var(--transition);
}

.toggle-switch input:checked + .toggle-track .toggle-thumb {
  transform: translateX(24px);
  background: var(--cyan);
}

#toggle-status {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.06em;
}

#toggle-status strong { color: var(--cyan); }

/* ── LEGEND ─────────────────────────────── */
#legend {
  position: absolute;
  bottom: 72px;
  right: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.legend-label {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-muted);
}

#legend-gradient {
  width: 140px;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(to right,
    #4575b4, #74add1, #abd9e9, #e0f3f8,
    #ffffbf, #fee090, #fdae61, #f46d43, #d73027
  );
}

#legend-title {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  writing-mode: vertical-rl;
  text-transform: uppercase;
  margin-left: 4px;
}

/* ── GLOBE ──────────────────────────────── */
#globe-container {
  grid-area: globe;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#globe-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

#globe-svg:active { cursor: grabbing; }

/* Globe layers */
.globe-sphere {
  fill: #070f20;
  stroke: #1a2e4a;
  stroke-width: 1;
}

.graticule {
  fill: none;
  stroke: #0d1e35;
  stroke-width: 0.5;
}

.land {
  fill: #0f2340;
  stroke: #1d3a5e;
  stroke-width: 0.4;
}

.border {
  fill: none;
  stroke: #1a3055;
  stroke-width: 0.3;
}

.weather-dot {
  r: 4;
  stroke: rgba(0,0,0,0.4);
  stroke-width: 0.8;
  cursor: pointer;
  transition: r 0.15s ease, stroke-width 0.15s ease;
  opacity: 0.92;
}

.weather-dot:hover,
.weather-dot.active {
  r: 7;
  stroke: #fff;
  stroke-width: 1.2;
  opacity: 1;
}

/* ── LOADING ────────────────────────────── */
#loading-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 20;
  transition: opacity 0.4s ease;
}

#loading-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

#loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--cyan);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

#loading-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

/* ── TOOLTIP ────────────────────────────── */
#tooltip {
  position: fixed;
  z-index: 100;
  background: rgba(5, 13, 26, 0.97);
  border: 1px solid var(--border);
  border-top: 2px solid var(--cyan);
  border-radius: 2px;
  padding: 16px 18px;
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  pointer-events: none;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  transition: opacity 0.15s ease;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

#tooltip.hidden { opacity: 0; pointer-events: none; }

.tt-header {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.tt-country {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.06em;
}

.tt-city {
  font-family: var(--sans);
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.tt-temp-big {
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 700;
  margin-top: 4px;
  /* color set dynamically by JS */
}

.tt-condition {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.tt-section {
  margin-top: 10px;
}

.tt-section-title {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cyan-dim);
  margin-bottom: 6px;
}

.tt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
}

.tt-row {
  display: flex;
  flex-direction: column;
}

.tt-label {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.tt-value {
  font-family: var(--sans);
  font-size: 12px;
  color: var(--text);
  font-weight: 500;
}

.tt-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 10px 0;
}

/* Moon phase emoji span */
.tt-moon { font-size: 16px; vertical-align: middle; margin-right: 4px; }

/* AQI badge */
.aqi-badge {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 2px;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}
.aqi-1 { background: #00e400; color: #000; }
.aqi-2 { background: #ffff00; color: #000; }
.aqi-3 { background: #ff7e00; color: #000; }
.aqi-4 { background: #ff0000; }
.aqi-5 { background: #8f3f97; }
.aqi-6 { background: #7e0023; }

/* ── STATS BAR ──────────────────────────── */
#stats-bar {
  grid-area: stats;
  display: flex;
  justify-content: center;
  gap: 0;
  border-top: 1px solid var(--border);
  padding: 10px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 36px;
  border-right: 1px solid var(--border);
}
.stat-item:last-child { border-right: none; }

.stat-val {
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--cyan);
}

.stat-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 2px;
}
```

---

### `static/js/colorScale.js`

```javascript
/**
 * Maps temperature in Celsius to a hex color.
 * Cold (≤ -30°C) → blue  (#4575b4)
 * Hot (≥  50°C) → red   (#d73027)
 * Matches the legend gradient exactly.
 */
const tempColorScale = d3.scaleLinear()
  .domain([-30, -10, 0, 10, 20, 30, 40, 50])
  .range([
    "#4575b4",
    "#74add1",
    "#abd9e9",
    "#e0f3f8",
    "#ffffbf",
    "#fdae61",
    "#f46d43",
    "#d73027"
  ])
  .clamp(true);
```

---

### `static/js/tooltip.js`

```javascript
/**
 * Builds the full tooltip HTML for a weather data point.
 * Called with the data object and a pixel color string for the temp.
 */

const MOON_PHASES = {
  "New Moon": "🌑",
  "Waxing Crescent": "🌒",
  "First Quarter": "🌓",
  "Waxing Gibbous": "🌔",
  "Full Moon": "🌕",
  "Waning Gibbous": "🌖",
  "Last Quarter": "🌗",
  "Waning Crescent": "🌘"
};

const AQI_LABELS = ["", "Good", "Moderate", "Unhealthy (Sensitive)", "Unhealthy", "Very Unhealthy", "Hazardous"];

function fmt(val, unit = "", decimals = 1) {
  if (val === null || val === undefined) return "—";
  const n = parseFloat(val);
  if (isNaN(n)) return String(val);
  return n.toFixed(decimals) + (unit ? " " + unit : "");
}

function buildTooltip(d) {
  const color = tempColorScale(d.temperature_celsius);
  const moonEmoji = MOON_PHASES[d.moon_phase] || "🌙";
  const aqiIdx = parseInt(d.air_quality_us_epa_index) || 1;
  const aqiLabel = AQI_LABELS[aqiIdx] || "—";

  return `
    <div class="tt-header">
      <div class="tt-country">${d.country}</div>
      <div class="tt-city">${d.location_name} &nbsp;·&nbsp; ${d.timezone}</div>
      <div class="tt-temp-big" style="color:${color}">${fmt(d.temperature_celsius, "°C", 1)}</div>
      <div class="tt-condition">${d.condition_text}</div>
    </div>

    <div class="tt-section">
      <div class="tt-section-title">Temperature</div>
      <div class="tt-grid">
        <div class="tt-row"><span class="tt-label">Celsius</span><span class="tt-value">${fmt(d.temperature_celsius, "°C")}</span></div>
        <div class="tt-row"><span class="tt-label">Fahrenheit</span><span class="tt-value">${fmt(d.temperature_fahrenheit, "°F")}</span></div>
        <div class="tt-row"><span class="tt-label">Feels Like (C)</span><span class="tt-value">${fmt(d.feels_like_celsius, "°C")}</span></div>
        <div class="tt-row"><span class="tt-label">Feels Like (F)</span><span class="tt-value">${fmt(d.feels_like_fahrenheit, "°F")}</span></div>
      </div>
    </div>

    <hr class="tt-divider"/>

    <div class="tt-section">
      <div class="tt-section-title">Wind & Pressure</div>
      <div class="tt-grid">
        <div class="tt-row"><span class="tt-label">Speed</span><span class="tt-value">${fmt(d.wind_kph, "kph")} / ${fmt(d.wind_mph, "mph")}</span></div>
        <div class="tt-row"><span class="tt-label">Direction</span><span class="tt-value">${d.wind_direction || "—"} (${d.wind_degree || 0}°)</span></div>
        <div class="tt-row"><span class="tt-label">Gust</span><span class="tt-value">${fmt(d.gust_kph, "kph")}</span></div>
        <div class="tt-row"><span class="tt-label">Pressure</span><span class="tt-value">${fmt(d.pressure_mb, "mb")}</span></div>
      </div>
    </div>

    <hr class="tt-divider"/>

    <div class="tt-section">
      <div class="tt-section-title">Atmosphere</div>
      <div class="tt-grid">
        <div class="tt-row"><span class="tt-label">Humidity</span><span class="tt-value">${fmt(d.humidity, "%", 0)}</span></div>
        <div class="tt-row"><span class="tt-label">Cloud Cover</span><span class="tt-value">${fmt(d.cloud, "%", 0)}</span></div>
        <div class="tt-row"><span class="tt-label">Precipitation</span><span class="tt-value">${fmt(d.precip_mm, "mm")}</span></div>
        <div class="tt-row"><span class="tt-label">Visibility</span><span class="tt-value">${fmt(d.visibility_km, "km")}</span></div>
        <div class="tt-row"><span class="tt-label">UV Index</span><span class="tt-value">${fmt(d.uv_index, "", 1)}</span></div>
      </div>
    </div>

    <hr class="tt-divider"/>

    <div class="tt-section">
      <div class="tt-section-title">Air Quality</div>
      <div class="tt-grid">
        <div class="tt-row"><span class="tt-label">CO</span><span class="tt-value">${fmt(d.air_quality_Carbon_Monoxide, "μg/m³")}</span></div>
        <div class="tt-row"><span class="tt-label">Ozone</span><span class="tt-value">${fmt(d.air_quality_Ozone, "μg/m³")}</span></div>
        <div class="tt-row"><span class="tt-label">NO₂</span><span class="tt-value">${fmt(d.air_quality_Nitrogen_dioxide, "μg/m³")}</span></div>
        <div class="tt-row"><span class="tt-label">SO₂</span><span class="tt-value">${fmt(d.air_quality_Sulphur_dioxide, "μg/m³")}</span></div>
        <div class="tt-row"><span class="tt-label">PM2.5</span><span class="tt-value">${fmt(d.air_quality_PM2_5, "μg/m³")}</span></div>
        <div class="tt-row"><span class="tt-label">PM10</span><span class="tt-value">${fmt(d.air_quality_PM10, "μg/m³")}</span></div>
      </div>
      <div style="margin-top:8px">
        <span class="tt-label">US EPA Index: </span>
        <span class="aqi-badge aqi-${aqiIdx}">${aqiLabel}</span>
      </div>
      <div style="margin-top:4px">
        <span class="tt-label">UK DEFRA Index: </span>
        <span class="tt-value">${d.air_quality_gb_defra_index || "—"}</span>
      </div>
    </div>

    <hr class="tt-divider"/>

    <div class="tt-section">
      <div class="tt-section-title">Astronomical</div>
      <div class="tt-grid">
        <div class="tt-row"><span class="tt-label">Sunrise</span><span class="tt-value">${d.sunrise || "—"}</span></div>
        <div class="tt-row"><span class="tt-label">Sunset</span><span class="tt-value">${d.sunset || "—"}</span></div>
        <div class="tt-row"><span class="tt-label">Moonrise</span><span class="tt-value">${d.moonrise || "—"}</span></div>
        <div class="tt-row"><span class="tt-label">Moonset</span><span class="tt-value">${d.moonset || "—"}</span></div>
      </div>
      <div style="margin-top:8px">
        <span class="tt-moon">${moonEmoji}</span>
        <span class="tt-value">${d.moon_phase || "—"}</span>
        <span class="tt-label" style="margin-left:6px">${fmt(d.moon_illumination, "%", 0)} lit</span>
      </div>
    </div>

    <div style="margin-top:10px; font-family:var(--mono); font-size:9px; color:var(--text-muted);">
      Updated: ${d.last_updated || "—"}
    </div>
  `;
}

function positionTooltip(tooltip, event) {
  const pad = 16;
  const tw = 320;
  const th = tooltip.offsetHeight;
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  let x = event.clientX + pad;
  let y = event.clientY + pad;

  if (x + tw > ww - pad) x = event.clientX - tw - pad;
  if (y + th > wh - pad) y = wh - th - pad;
  if (y < pad) y = pad;

  tooltip.style.left = x + "px";
  tooltip.style.top  = y + "px";
}
```

---

### `static/js/globe.js`

```javascript
/**
 * D3 Globe Engine
 * Renders an orthographic globe with:
 *   - Drag to rotate
 *   - Scroll to zoom
 *   - Land/borders from TopoJSON world-110m
 *   - Weather dots colored by temperature
 *   - Hover/click tooltip
 */

const Globe = (() => {
  let svg, g, projection, path, geoPath;
  let width, height, sensitivity = 75;
  let weatherData = [];
  let activeDot = null;
  const tooltip = document.getElementById("tooltip");

  // World topology — load once
  let worldTopo = null;

  async function loadWorld() {
    worldTopo = await d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    );
  }

  function init() {
    const container = document.getElementById("globe-container");
    width  = container.clientWidth;
    height = container.clientHeight;

    svg = d3.select("#globe-svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    g = svg.append("g");

    projection = d3.geoOrthographic()
      .scale(Math.min(width, height) * 0.44)
      .center([0, 0])
      .rotate([0, -20])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    geoPath = d3.geoPath().projection(projection);

    // Sphere (ocean)
    g.append("path")
      .datum({ type: "Sphere" })
      .attr("class", "globe-sphere")
      .attr("d", geoPath);

    // Graticule
    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("class", "graticule")
      .attr("d", geoPath);

    // Land
    if (worldTopo) {
      const land = topojson.feature(worldTopo, worldTopo.objects.land);
      g.append("path")
        .datum(land)
        .attr("class", "land")
        .attr("d", geoPath);

      // Borders
      const borders = topojson.mesh(worldTopo, worldTopo.objects.countries, (a, b) => a !== b);
      g.append("path")
        .datum(borders)
        .attr("class", "border")
        .attr("d", geoPath);
    }

    // Drag
    const drag = d3.drag()
      .on("drag", (event) => {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([
          rotate[0] + event.dx * k,
          rotate[1] - event.dy * k
        ]);
        geoPath.projection(projection);
        updateGlobe();
      });

    // Scroll zoom
    const zoom = d3.zoom()
      .scaleExtent([0.4, 4])
      .on("zoom", (event) => {
        const scale = Math.min(width, height) * 0.44 * event.transform.k;
        projection.scale(scale);
        updateGlobe();
      });

    svg.call(drag).call(zoom);

    // Auto-rotate (slow)
    let rotating = true;
    let rotateTimer = d3.timer(() => {
      if (!rotating) return;
      const rotate = projection.rotate();
      projection.rotate([rotate[0] + 0.12, rotate[1]]);
      updateGlobe();
    });

    // Pause rotation on drag
    svg.on("mousedown.rotate", () => { rotating = false; })
       .on("mouseup.rotate",   () => { rotating = true; });

    // Window resize
    window.addEventListener("resize", () => {
      width  = container.clientWidth;
      height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      projection.translate([width / 2, height / 2]);
      updateGlobe();
    });
  }

  function updateGlobe() {
    // Redraw static paths
    g.selectAll(".globe-sphere").attr("d", geoPath);
    g.selectAll(".graticule").attr("d", geoPath);
    g.selectAll(".land").attr("d", geoPath);
    g.selectAll(".border").attr("d", geoPath);

    // Redraw dots
    g.selectAll(".weather-dot")
      .attr("cx", d => {
        const p = projection([d.longitude, d.latitude]);
        return p ? p[0] : null;
      })
      .attr("cy", d => {
        const p = projection([d.longitude, d.latitude]);
        return p ? p[1] : null;
      })
      .style("display", d => {
        // Hide dots on the back hemisphere
        const p = projection([d.longitude, d.latitude]);
        if (!p) return "none";
        const rotate = projection.rotate();
        const lon = d.longitude + rotate[0];
        const lat = d.latitude  - rotate[1];
        // Visibility check via geoDistance from center
        const center = projection.invert([width / 2, height / 2]);
        if (!center) return "none";
        const dist = d3.geoDistance(
          [d.longitude, d.latitude],
          center
        );
        return dist > Math.PI / 2 ? "none" : null;
      });
  }

  function renderDots(data) {
    weatherData = data;

    // Remove existing dots
    g.selectAll(".weather-dot").remove();

    g.selectAll(".weather-dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "weather-dot")
      .attr("cx", d => {
        const p = projection([d.longitude, d.latitude]);
        return p ? p[0] : 0;
      })
      .attr("cy", d => {
        const p = projection([d.longitude, d.latitude]);
        return p ? p[1] : 0;
      })
      .attr("fill", d => tempColorScale(d.temperature_celsius))
      .on("mousemove", function(event, d) {
        tooltip.innerHTML = buildTooltip(d);
        tooltip.classList.remove("hidden");
        positionTooltip(tooltip, event);
      })
      .on("mouseleave", function() {
        tooltip.classList.add("hidden");
      })
      .on("click", function(event, d) {
        // Toggle active dot
        if (activeDot === this) {
          activeDot = null;
          d3.select(this).classed("active", false);
          tooltip.classList.add("hidden");
        } else {
          if (activeDot) d3.select(activeDot).classed("active", false);
          activeDot = this;
          d3.select(this).classed("active", true);
          tooltip.innerHTML = buildTooltip(d);
          tooltip.classList.remove("hidden");
          positionTooltip(tooltip, event);
        }
      });

    updateGlobe();
  }

  return { init, loadWorld, renderDots };
})();
```

---

### `static/js/main.js`

```javascript
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
```

---

## 7. Fake/Real Data Toggle

The toggle is a custom CSS checkbox styled as a pill switch in the top-right of the header.

| State | Label highlighted | Data source | Flask route used |
|---|---|---|---|
| OFF (default) | DEMO | `static/data/weather_fake.json` | None (served as static file) |
| ON | LIVE DB | `/api/weather` Flask endpoint | Queries PostgreSQL |

**Key behavior:**
- Switching the toggle immediately shows the loading overlay, fetches the new data source, re-renders all dots, and updates the stats bar
- If real DB is unavailable, an `alert()` shows the error and the toggle can be flipped back to demo
- The fake JSON file is served directly by Flask's static file handler — no DB connection needed

---

## 8. Tooltip System

The tooltip appears on **mousemove** (follows cursor) and stays pinned on **click** (click again to dismiss). It is never cut off by viewport edges — `positionTooltip()` detects overflow and flips to the opposite side.

**Tooltip sections in order:**
1. Header — Country, City, Timezone, Large temperature (colored), Condition text
2. Temperature — °C, °F, feels-like °C, feels-like °F
3. Wind & Pressure — speed (kph/mph), direction + degrees, gust, pressure mb
4. Atmosphere — humidity, cloud cover, precipitation, visibility, UV index
5. Air Quality — CO, Ozone, NO₂, SO₂, PM2.5, PM10, EPA index badge, DEFRA index
6. Astronomical — sunrise, sunset, moonrise, moonset, moon phase (with emoji), illumination %
7. Footer — last_updated timestamp

---

## 9. Visual Design Spec

| Element | Spec |
|---|---|
| Background | `#050d1a` near-black navy |
| Globe ocean | `#070f20` |
| Globe land | `#0f2340` dark teal-navy |
| Graticule | `#0d1e35` barely visible grid |
| Accent color | `#00d4ff` electric cyan |
| Font — headers/mono | Space Mono (Google Fonts) |
| Font — body/tooltip | DM Sans (Google Fonts) |
| Dot size | 4px default, 7px on hover/active |
| Dot colors | D3 diverging scale: `#4575b4` → `#d73027` (RdBu reversed) |
| Tooltip width | 320px fixed |
| Globe auto-rotate | 0.12°/frame, pauses on drag |
| Animation | Loading spinner, dot r transition, toggle thumb transition |

---

## 10. Complete File Contents

The agent must create **every file listed in Section 3** with the exact content specified in sections 5 and 6. Additionally:

### `static/data/weather_fake.json`

The agent must **generate this file from scratch** as a JSON array with **at least 60 entries**. Use realistic latitude/longitude for each country's capital city. Include a wide temperature range (min ~-30°C for Antarctica/Greenland, max ~45°C for Gulf states/Sahara). Every entry must have all 38 fields listed in Section 4a. No field may be null or missing — use plausible values.

**Suggested countries to include** (agent must generate all of these at minimum):

Africa: Nigeria, Egypt, South Africa, Kenya, Ethiopia, Morocco, Ghana, Tanzania, Algeria, Angola, Senegal, Tunisia

Asia: China, India, Japan, South Korea, Thailand, Vietnam, Indonesia, Philippines, Saudi Arabia, UAE, Israel, Turkey, Pakistan, Bangladesh, Malaysia

Europe: Germany, France, UK, Italy, Spain, Netherlands, Sweden, Norway, Finland, Poland, Greece, Albania, Portugal, Switzerland, Austria

North America: USA (Washington DC), Canada, Mexico, Cuba, Jamaica, Guatemala

South America: Brazil, Argentina, Colombia, Chile, Peru, Venezuela, Ecuador, Bolivia

Oceania: Australia, New Zealand, Papua New Guinea, Fiji

Polar/Extreme: Greenland (Nuuk, -20°C range), Iceland, Russia (Moscow), Kazakhstan

---

## 11. Setup & Run Instructions

### First-time setup (any computer):

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install flask psycopg2-binary python-dotenv

# 3. Copy env template and fill in DB credentials (only needed for Live DB mode)
cp .env.example .env
# Edit .env with your DB_HOST, DB_NAME, DB_USER, DB_PASSWORD

# 4. Run the app
python app.py
# OR: flask run

# 5. Open browser
# http://localhost:5000
```

### School computer (no DB):
- Run the app exactly as above
- Leave the toggle in **DEMO** position (default)
- The app will serve `weather_fake.json` with no DB connection

### School computer (with DB access):
- Fill in `.env` with the marigold DB credentials from your professor
- Flip the toggle to **LIVE DB**
- The globe will re-render with real data from PostgreSQL

---

## 12. Agent Execution Checklist

The AI coding agent must complete **every item** in order. Do not skip steps.

- [ ] **Create project folder** `weather-globe/` with the exact directory structure from Section 3
- [ ] **Create `requirements.txt`** with exact contents from Section 5
- [ ] **Create `.env.example`** with exact contents from Section 5
- [ ] **Create `db.py`** with exact contents from Section 5 — do not modify the SQL aliases
- [ ] **Create `app.py`** with exact contents from Section 5
- [ ] **Create `templates/index.html`** with exact contents from Section 6 — all script/link tags must be present
- [ ] **Create `static/css/style.css`** with exact contents from Section 6 — do not abbreviate or summarize, include every rule
- [ ] **Create `static/js/colorScale.js`** with exact contents from Section 6
- [ ] **Create `static/js/tooltip.js`** with exact contents from Section 6 — all 7 tooltip sections must be present
- [ ] **Create `static/js/globe.js`** with exact contents from Section 6 — drag, zoom, auto-rotate, visibility culling, dot rendering all required
- [ ] **Create `static/js/main.js`** with exact contents from Section 6
- [ ] **Generate `static/data/weather_fake.json`** — minimum 60 countries, all 38 fields, realistic coordinates and temperature range, valid JSON array
- [ ] **Verify** `weather_fake.json` is valid JSON (no trailing commas, no comments)
- [ ] **Verify** all CDN URLs in `index.html` are reachable (`d3@7`, `topojson@3`, `world-atlas@2`)
- [ ] **Run** `python app.py` and confirm no import errors or startup crashes
- [ ] **Open** `http://localhost:5000` — globe must render with land masses and dots visible
- [ ] **Test DEMO mode** — dots appear, hover tooltip shows all 7 sections, drag rotates globe, scroll zooms
- [ ] **Test toggle** — switching to LIVE DB attempts `/api/weather`; if DB not available, error message appears and app does not crash
- [ ] **Test stats bar** — country count, hottest, coldest, and average temp all display correctly
- [ ] **Test tooltip edge cases** — hover near right/bottom edge, tooltip flips to stay in viewport
- [ ] **Confirm auto-rotate** pauses on mousedown and resumes on mouseup

---

*End of Specification*