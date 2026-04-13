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