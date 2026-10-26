/* =========================================================
   GITHUB — public repositories via the GitHub REST API (no token).
   Safe to edit: GITHUB_USERNAME, FEATURED_REPOS, CACHE_MINUTES.
   Set GITHUB_USERNAME to the confirmed GitHub username.
   ========================================================= */
const GITHUB_USERNAME = "nikhil965";
const FEATURED_REPOS = [];   // repo names shown first, e.g. ["hotel-booking-cancellation"]
const CACHE_MINUTES = 30;
const MAX_REPOS = 6;

function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

async function fetchRepos() {
    const key = "gh-repos-" + GITHUB_USERNAME;
    try {
        const c = JSON.parse(localStorage.getItem(key) || "null");
        if (c && Date.now() - c.t < CACHE_MINUTES * 60000) return c.data;
    } catch (e) { /* storage unavailable */ }
    const res = await fetch("https://api.github.com/users/" + encodeURIComponent(GITHUB_USERNAME) + "/repos?per_page=100&sort=updated");
    if (res.status === 403 || res.status === 429) throw new Error("GitHub rate limit reached. Please try again later.");
    if (res.status === 404) throw new Error("GitHub user not found. Check the username in js/github.js.");
    if (!res.ok) throw new Error("GitHub returned an error (" + res.status + ").");
    const data = await res.json();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) { /* ignore */ }
    return data;
}

function repoCard(r) {
    const date = new Date(r.pushed_at || r.updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    return `<a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
    <h3>${esc(r.name)}${r.fork ? ' <span class="tag">Fork — not solely my work</span>' : ""}</h3>
    <p>${esc(r.description || "No description provided.")}</p>
    <div class="repo-meta"><span>${esc(r.language || "—")}</span><span>★ ${r.stargazers_count}</span><span>Forks ${r.forks_count}</span><span>Updated ${date}</span></div></a>`;
}

async function loadGithub() {
    const grid = document.getElementById("repo-grid");
    const all = document.getElementById("repo-all");
    if (!grid) return;
    if (!GITHUB_USERNAME) {
        grid.innerHTML = '<div class="state"><p>GitHub username not set yet. Add it to <code>js/github.js</code> to show public repositories here.</p></div>';
        return;
    }
    all.hidden = false; all.href = "https://github.com/" + GITHUB_USERNAME + "?tab=repositories";
    grid.innerHTML = '<div class="repo skeleton"></div>'.repeat(3);
    try {
        const repos = (await fetchRepos()).filter(r => !r.private);
        const rank = r => { const i = FEATURED_REPOS.indexOf(r.name); return i === -1 ? 999 : i; };
        repos.sort((a, b) => rank(a) - rank(b) || new Date(b.pushed_at) - new Date(a.pushed_at));
        grid.innerHTML = repos.length ? repos.slice(0, MAX_REPOS).map(repoCard).join("") : '<div class="state"><p>No public repositories yet.</p></div>';
    } catch (err) {
        grid.innerHTML = '<div class="state"><p>' + esc(err.message) + '</p><button class="btn ghost" id="retry">Retry</button></div>';
        document.getElementById("retry").addEventListener("click", loadGithub);
    }
}
document.addEventListener("DOMContentLoaded", loadGithub);