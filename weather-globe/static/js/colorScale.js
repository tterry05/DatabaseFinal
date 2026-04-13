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