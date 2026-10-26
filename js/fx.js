/* =========================================================
   FX — 3D data-globe, card tilt, cursor glow, scroll progress.
   Pure vanilla JS (canvas 2D with manual 3D projection).
   Safe to edit: POINTS (density), the colors in drawGlobe().
   ========================================================= */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const POINTS = 170;           // fewer = lighter on weak devices
  const mouse = { x: 0, y: 0 };

  /* ---- headline: split words for the 3D flip-in ---- */
  const h1 = document.querySelector(".hero h1");
  if (h1 && !reduced) {
    let i = 0;
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t.trim()) { frag.append(t); return; }
            const s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", i++); s.textContent = t; frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(h1);
  }

  /* ---- 3D globe of data nodes ---- */
  const cv = document.getElementById("globe");
  if (cv) {
    const ctx = cv.getContext("2d");
    const pts = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < POINTS; i++) {           // fibonacci sphere
      const y = 1 - (i / (POINTS - 1)) * 2, r = Math.sqrt(1 - y * y), t = ga * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    let size = 0, dpr = 1, visible = true, rotY = 0, tiltX = 0.3, tx = 0.3, ty = 0;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      size = cv.clientWidth; cv.width = cv.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const drawGlobe = () => {
      ctx.clearRect(0, 0, size, size);
      const R = size * 0.34, cx = size / 2, cy = size / 2, cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
      const proj = pts.map(([x, y, z]) => {
        let X = x * cosY + z * sinY, Z = -x * sinY + z * cosY;
        let Y = y * cosX - Z * sinX; Z = y * sinX + Z * cosX;
        const s = 1 / (1.9 - Z * 0.55);            // perspective
        return { X, Y, Z, px: cx + X * R * s * 1.9, py: cy + Y * R * s * 1.9, s };
      });
      ctx.lineWidth = 0.6;
      for (let i = 0; i < proj.length; i++) for (let j = i + 1; j < proj.length; j++) {
        const a = proj[i], b = proj[j], d = (a.X - b.X) ** 2 + (a.Y - b.Y) ** 2 + (a.Z - b.Z) ** 2;
        if (d < 0.17) {
          ctx.strokeStyle = `rgba(53,230,160,${(0.34 * (1 - d / 0.17) * ((a.Z + b.Z + 2) / 4)).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
        }
      }
      proj.forEach((p, i) => {
        const depth = (p.Z + 1) / 2, hot = i % 23 === 0;
        ctx.fillStyle = hot ? `rgba(98,201,255,${0.4 + depth * 0.6})` : `rgba(53,230,160,${0.2 + depth * 0.8})`;
        ctx.beginPath(); ctx.arc(p.px, p.py, (hot ? 2.6 : 1.6) * (0.6 + depth * 0.8), 0, 6.283); ctx.fill();
      });
    };
    const loop = () => {
      if (visible && !document.hidden) {
        rotY += 0.0035 + mouse.x * 0.0025;
        tx = 0.3 + mouse.y * 0.35; tiltX += (tx - tiltX) * 0.05;
        drawGlobe();
      }
      requestAnimationFrame(loop);
    };
    resize(); addEventListener("resize", resize);
    new IntersectionObserver(e => { visible = e[0].isIntersecting; }).observe(cv);
    if (reduced) drawGlobe(); else loop();
  }

  addEventListener("pointermove", e => { mouse.x = (e.clientX / innerWidth - 0.5) * 2; mouse.y = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  /* ---- scroll progress ---- */
  const bar = document.getElementById("progress");
  const prog = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.width = (m > 0 ? (scrollY / m) * 100 : 0) + "%"; };
  addEventListener("scroll", prog, { passive: true }); prog();

  if (reduced || !finePointer) return;

  /* ---- cursor glow ---- */
  const spot = document.getElementById("spot");
  addEventListener("pointermove", e => { spot.style.setProperty("--x", e.clientX + "px"); spot.style.setProperty("--y", e.clientY + "px"); spot.classList.add("on"); }, { passive: true });
  document.addEventListener("pointerleave", () => spot.classList.remove("on"));

  /* ---- 3D card tilt (event delegation, works for re-rendered cards) ---- */
  const SEL = ".pcard, .dash, .ccard, .repo, .cards article, .sk-info, .timeline li";
  let cur = null;
  const reset = el => { if (el) { el.style.transform = ""; el.classList.remove("hot"); } };
  document.addEventListener("pointermove", e => {
    const el = e.target.closest ? e.target.closest(SEL) : null;
    if (el !== cur) { reset(cur); cur = el; if (el) el.classList.add("tilt"); }
    if (!el) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const max = el.classList.contains("pcard") ? 5 : el.classList.contains("dash") ? 8 : 6;
    el.style.transform = `perspective(900px) rotateY(${((px - 0.5) * max * 2).toFixed(2)}deg) rotateX(${((0.5 - py) * max * 2).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%"); el.classList.add("hot");
  }, { passive: true });
  document.addEventListener("pointerleave", () => { reset(cur); cur = null; });
})();