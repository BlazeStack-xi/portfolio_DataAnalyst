/* =========================================================
   MAIN — navigation, rendering, filters, modal, charts.
   Content lives in config.js / projects.js / github.js.
   Safe to edit: nothing required here for routine updates.
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc2 = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CAT_NAMES = { "machine-learning": "Machine Learning", "data-analytics": "Data Analytics", "ai-applications": "AI Applications" };

/* ---------- links (hidden unless a real URL exists) ---------- */
function setupLinks() {
    const gh = typeof GITHUB_USERNAME !== "undefined" && GITHUB_USERNAME ? "https://github.com/" + GITHUB_USERNAME : "";
    const urls = { github: gh, linkedin: siteConfig.linkedinUrl };
    $$("[data-link]").forEach(a => {
        const u = urls[a.dataset.link];
        if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener"; a.hidden = false; }
    });
    $("#mail").href = "mailto:" + siteConfig.email;
    if (siteConfig.phone) { const p = $("#phone"); p.href = "tel:" + siteConfig.phone.replace(/[^+\d]/g, ""); p.textContent = "Call " + siteConfig.phone; p.hidden = false; }
    const hasResume = Boolean(siteConfig.resumeUrl);
    const resumeSection = $("#resume");
    resumeSection.hidden = true;
    $("#resume-cta").hidden = !hasResume;
    if (hasResume) {
        $("#res-dl").href = siteConfig.resumeUrl; $("#res-open").href = siteConfig.resumeUrl;
        $("#res-obj").data = siteConfig.resumeUrl + "#view=FitH";
        $("#resume-cta").addEventListener("click", () => {
            resumeSection.hidden = false;
            resumeSection.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        });
    }
    $("#yr").textContent = new Date().getFullYear();
}

/* ---------- navigation ---------- */
function setupNav() {
    const nav = $("#nav"), burger = $("#burger"), menu = $("#menu"), top = $("#top");
    const onScroll = () => { nav.classList.toggle("scrolled", scrollY > 20); top.hidden = scrollY < 600; };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const close = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); };
    burger.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("#menu a").forEach(a => a.addEventListener("click", close));
    addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
    const links = $$("#menu a");
    const map = { home: "#home", projects: "#projects", repos: "#projects", collab: "#projects", experience: "#experience", education: "#skills", skills: "#skills", contact: "#contact" };
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === map[e.target.id]));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(s => io.observe(s));
}

/* ---------- project previews (CSS fallbacks) ---------- */
function mockPreview(type) {
    if (type === "ml") return `<div class="mock" aria-hidden="true">
    <div class="row"><div class="b">cancellation distribution<div class="donut"></div></div>
    <div class="b">feature importance<div class="hbars"><div><i style="width:90%"></i></div><div><i style="width:64%"></i></div><div><i style="width:48%"></i></div><div><i style="width:30%"></i></div></div></div></div>
    <div class="b">model comparison: Logistic Regression · Decision Tree · Random Forest</div></div>`;
    if (type === "chat") return `<div class="mock" aria-hidden="true">
    <div class="msg u">What can you help me with?</div><div class="tool">tool_call → executing…</div>
    <div class="msg a">Tool result folded into a natural-language reply.</div></div>`;
    return `<div class="mock" aria-hidden="true"><div class="b">project preview</div></div>`;
}
function previewHtml(p) {
    const cap = '<span class="cap mono">Visual representation, not a screenshot</span>';
    return `<div class="pv" data-prev="${esc2(p.preview)}">${p.image ? `<img src="${esc2(p.image)}" alt="Screenshot of ${esc2(p.title)}" loading="lazy">` : mockPreview(p.preview)}${p.image ? "" : cap}</div>`;
}
function btns(p, detail = true) {
    return `<div class="btn-row">${detail ? `<button class="btn" data-detail="${esc2(p.id)}">View Details</button>` : ""}
  ${p.githubUrl ? `<a class="btn ghost" href="${esc2(p.githubUrl)}" target="_blank" rel="noopener">View on GitHub</a>` : ""}
  ${p.liveUrl ? `<a class="btn ghost" href="${esc2(p.liveUrl)}" target="_blank" rel="noopener">Live Demo</a>` : ""}</div>`;
}
function renderFeatured() {
    $("#featured").innerHTML = projects.filter(p => p.featured).map(p => `<article class="pcard rv">${previewHtml(p)}
    <div class="pbody"><span class="mono kicker" style="margin:0">${esc2(p.label)}</span><h3>${esc2(p.title)}</h3><p>${esc2(p.description)}</p>
    <div class="tags-row">${p.technologies.map(t => `<span class="tag">${esc2(t)}</span>`).join("")}</div>${btns(p)}</div></article>`).join("");
    // broken screenshot -> CSS fallback
    $$(".pv img").forEach(img => img.addEventListener("error", () => {
        const pv = img.parentElement; pv.innerHTML = mockPreview(pv.dataset.prev) + '<span class="cap mono">Visual representation, not a screenshot</span>';
    }));
}

/* ---------- collaboration / filter grid ---------- */
function renderCollab(f = "all") {
    const list = projects.filter(p => f === "all" || p.category === f || p.collaborationType === f);
    const grid = $("#collab-grid");
    if (!list.length) {
        const gh = typeof GITHUB_USERNAME !== "undefined" && GITHUB_USERNAME ? "https://github.com/" + GITHUB_USERNAME : "";
        grid.innerHTML = `<div class="state"><p>${f === "collaboration" ? "No verified collaborations to show yet." : "No projects in this category yet."}</p>${gh ? `<a class="btn ghost" href="${gh}" target="_blank" rel="noopener">See GitHub</a>` : ""}</div>`;
        return;
    }
    grid.innerHTML = list.map(p => `<article class="ccard"><span class="mono kicker" style="margin:0">${esc2(CAT_NAMES[p.category] || p.category)} · ${p.collaborationType === "personal" ? "Personal" : "Collaboration"}</span>
    <h3>${esc2(p.title)}</h3><p>${esc2(p.description)}</p>
    ${p.contribution ? `<p><b>My contribution:</b> ${esc2(p.contribution)}</p>` : ""}
    ${p.contributors?.length ? `<p>With: ${p.contributors.map(esc2).join(", ")}</p>` : ""}
    ${p.pullRequestUrl ? `<a class="tag" href="${esc2(p.pullRequestUrl)}" target="_blank" rel="noopener">Pull request</a>` : ""}${btns(p)}</article>`).join("");
}
function setupFilters() {
    renderCollab();
    $$("#filters .chip").forEach(c => c.addEventListener("click", () => {
        $$("#filters .chip").forEach(x => { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); });
        c.classList.add("on"); c.setAttribute("aria-pressed", "true"); renderCollab(c.dataset.f);
    }));
}

/* ---------- modal ---------- */
function setupModal() {
    const m = $("#modal");
    document.addEventListener("click", e => {
        const b = e.target.closest("[data-detail]"); if (!b) return;
        const p = projects.find(x => x.id === b.dataset.detail); if (!p) return;
        const d = p.details || {};
        $("#m-body").innerHTML = `<span class="mono kicker">${esc2(p.label || "")}</span><h3 id="m-title">${esc2(p.title)}</h3><p style="color:var(--muted)">${esc2(p.description)}</p>
      ${d.stages?.length ? `<h4>Stages / capabilities</h4><ol>${d.stages.map(s => `<li>${esc2(s)}</li>`).join("")}</ol>` : ""}
      ${d.models?.length ? `<h4>Models</h4><ul>${d.models.map(s => `<li>${esc2(s)}</li>`).join("")}</ul>` : ""}
      ${p.metrics?.length ? `<h4>Results</h4><ul>${p.metrics.map(s => `<li>${esc2(s)}</li>`).join("")}</ul>` : ""}
      <h4>Technologies</h4><div class="tags-row">${p.technologies.map(t => `<span class="tag">${esc2(t)}</span>`).join("")}</div><div style="margin-top:20px">${btns(p, false)}</div>`;
        m.showModal();
    });
    $("#m-close").addEventListener("click", () => m.close());
    m.addEventListener("click", e => { if (e.target === m) m.close(); });
}

/* ---------- experience, skills, education ---------- */
function renderStatic() {
    $("#timeline").innerHTML = experience.map(x => `<li class="rv"><h3>${esc2(x.company)}</h3><span class="meta mono">${esc2(x.role)} · ${esc2(x.dates)}</span><ul>${x.points.map(p => `<li>${esc2(p)}</li>`).join("")}</ul></li>`).join("");
    const cats = Object.keys(skills), rail = $("#cats"), orbit = $("#orbit"), info = $("#sk-info");
    const usageOf = s => (typeof skillUsage !== "undefined" && skillUsage[s]) || [];
    let curCat = cats[0];
    const showSkill = s => {
        $$(".chip-sk", orbit).forEach(b => b.classList.toggle("on", b.dataset.s === s));
        const u = usageOf(s);
        info.innerHTML = `<span class="mono">${esc2(curCat)}</span><h3>${esc2(s)}</h3>` + (u.length
            ? `<p class="mono">Used in</p><ul>${u.map(x => `<li>${esc2(x)}</li>`).join("")}</ul>`
            : `<p>Part of my toolkit.</p>`);
    };
    const pick = (c, first = true) => {
        curCat = c; const list = skills[c];
        $$(".cat", rail).forEach(b => b.setAttribute("aria-selected", b.dataset.c === c));
        orbit.innerHTML = `<div class="core"><span class="mono">${esc2(c)}</span><b>${list.length} skills</b></div><div class="ring">` +
            list.map((s, i) => `<div class="node" style="--a:${(360 / list.length) * i - 90}deg"><div class="un" style="--k:${i}"><button class="chip-sk" data-s="${esc2(s)}">${esc2(s)}</button></div></div>`).join("") + `</div>`;
        if (first) showSkill(list.find(s => usageOf(s).length) || list[0]);
    };
    rail.innerHTML = cats.map(c => `<button class="cat" role="tab" data-c="${esc2(c)}">${esc2(c)}<i>${skills[c].length}</i></button>`).join("");
    rail.addEventListener("click", e => { const b = e.target.closest(".cat"); if (b) pick(b.dataset.c); });
    orbit.addEventListener("click", e => { const b = e.target.closest(".chip-sk"); if (b) showSkill(b.dataset.s); });
    pick(cats[0]);
    const card = x => `<article class="rv"><h4>${esc2(x.title)}</h4><p>${esc2(x.org)} · ${esc2(x.dates)}</p>${x.url ? `<a class="tag" href="${esc2(x.url)}" target="_blank" rel="noopener">Verify credential</a>` : ""}</article>`;
    $("#edu").innerHTML = education.map(card).join("");
    $("#certs").innerHTML = certifications.map(card).join("");
}

/* ---------- reveal + charts ---------- */
function setupReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    $$(".rv").forEach(el => io.observe(el));
}
function setupHero() {
    const bar = $("#proc"), pct = $("#pct");
    const end = () => { bar.style.width = "100%"; pct.textContent = "100%"; };
    if (reduced) end(); else { let v = 0; const t = setInterval(() => { v = Math.min(100, v + 2); bar.style.width = v + "%"; pct.textContent = v + "%"; if (v >= 100) clearInterval(t); }, 30); }
    if (typeof Chart === "undefined") return;   // CDN blocked: dashboard still shows table
    Chart.defaults.color = "#929C9A"; Chart.defaults.font.family = "JetBrains Mono";
    const opts = {
        animation: reduced ? false : { duration: 1400 }, plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { grid: { color: "rgba(255,255,255,.06)" }, ticks: { display: false } }, y: { grid: { color: "rgba(255,255,255,.06)" }, ticks: { display: false } } }, events: []
    };
    new Chart($("#lineChart"), { type: "line", data: { labels: [1, 2, 3, 4, 5, 6, 7, 8], datasets: [{ data: [12, 19, 14, 24, 21, 30, 27, 36], borderColor: "#35E6A0", pointBackgroundColor: "#35E6A0", tension: .35, borderWidth: 2 }] }, options: opts });
    new Chart($("#barChart"), { type: "bar", data: { labels: ["A", "B", "C", "D", "E"], datasets: [{ data: [22, 35, 18, 30, 26], backgroundColor: "#62C9FF", borderRadius: 4 }] }, options: opts });
}

document.addEventListener("DOMContentLoaded", () => {
    setupLinks(); setupNav(); renderFeatured(); setupFilters(); setupModal(); renderStatic(); setupHero(); setupReveal();
});