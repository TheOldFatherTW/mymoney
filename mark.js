/* Product mark for MyMoney — official 金標: Schwab seal + M. */
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function markSvg() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 88 88");
    svg.setAttribute("class", "money-mark-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = [
      '<circle cx="44" cy="44" r="34" fill="none" stroke="currentColor" stroke-width="4.4"/>',
      '<circle cx="44" cy="44" r="26" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.45"/>',
      '<path d="M26 63V29h7.2L44 46.5 54.8 29H62v34h-6.6V39.5L44 56.2 32.6 39.5V63H26z" fill="currentColor"/>',
    ].join("");
    return svg;
  }

  function mount(root) {
    if (!root || root.getAttribute("data-mark") === "on") return;
    root.setAttribute("data-mark", "on");
    root.innerHTML = "";
    root.appendChild(markSvg());
  }

  function mountBar(root) {
    if (!root || root.getAttribute("data-mark-bar") === "on") return;
    root.setAttribute("data-mark-bar", "on");
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 12");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "money-bar-svg");
    svg.setAttribute("aria-hidden", "true");
    const track = document.createElementNS(SVG_NS, "path");
    track.setAttribute("d", "M 2 6 L 98 6");
    track.setAttribute("fill", "none");
    track.setAttribute("stroke", "currentColor");
    track.setAttribute("stroke-width", "3.2");
    track.setAttribute("stroke-linecap", "round");
    track.setAttribute("opacity", "0.14");
    const fill = document.createElementNS(SVG_NS, "path");
    fill.setAttribute("fill", "none");
    fill.setAttribute("stroke", "currentColor");
    fill.setAttribute("stroke-width", "3.2");
    fill.setAttribute("stroke-linecap", "round");
    fill.setAttribute("opacity", "0.92");
    svg.appendChild(track);
    svg.appendChild(fill);
    root.innerHTML = "";
    root.appendChild(svg);
    const start = performance.now();
    function tick(now) {
      if (!root.isConnected) return;
      const loop = ((now - start) % 4200) / 4200;
      const slide = (Math.sin(loop * Math.PI * 2) + 1) / 2;
      const x = 2 + 96 * (0.2 + slide * 0.24);
      fill.setAttribute("d", "M 2 6 L " + x.toFixed(2) + " 6");
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  window.MoneyMark = { mount: mount, mountBar: mountBar };
  function boot() {
    mount(document.getElementById("money-mark"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
