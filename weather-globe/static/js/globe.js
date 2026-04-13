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