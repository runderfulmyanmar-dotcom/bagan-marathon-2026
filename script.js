const DATA_FILES = {
  "10KM": "assets/10Km.csv",
  "21KM": "assets/21Km.csv",
  "42KM": "assets/42Km.csv"
};
const PAGE_SIZE = 20;
let allData = {};
let activeCategory = "10KM";
let currentPage = 1;

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { field += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(field); field = ""; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++;
      row.push(field); field = "";
      if (row.some(v => v.trim() !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some(v => v.trim() !== "")) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map(h => h.trim().replace(/^\uFEFF/, "").toLowerCase());
  return rows.map(values => {
    const item = {};
    headers.forEach((header, i) => item[header] = (values[i] || "").trim());
    return item;
  });
}
function getValue(row, key) {
  const aliases = {
    "ticket id": ["ticket id"], "full name": ["full name"],
    "bib name": ["bib name"], "bib number": ["bib number"],
    "gender": ["gender"], "category": ["category"],
    "t-shirt size": ["t-shirt size", "t-shirt size", "t shirt size"],
    "remark": ["remark"]
  };
  for (const alias of aliases[key] || [key]) if (row[alias] !== undefined) return row[alias];
  return "";
}
async function loadData() {
  const entries = Object.entries(DATA_FILES);
  await Promise.all(entries.map(async ([category, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cannot load ${url}`);
    allData[category] = parseCSV(await response.text());
  }));
  document.getElementById("count10").textContent = allData["10KM"].length.toLocaleString();
  document.getElementById("count21").textContent = allData["21KM"].length.toLocaleString();
  document.getElementById("count42").textContent = allData["42KM"].length.toLocaleString();
  render();
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function filteredRows() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  return (allData[activeCategory] || []).filter(row => {
    if (!query) return true;
    return ["ticket id","full name","bib name","bib number"].some(key => getValue(row,key).toLowerCase().includes(query));
  });
}
function render() {
  const rows = filteredRows();
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);
  document.getElementById("resultCount").textContent = `${rows.length.toLocaleString()} participant${rows.length === 1 ? "" : "s"} found`;
  const results = document.getElementById("results");
  if (!visible.length) {
    results.innerHTML = '<div class="empty">No participant found. Please check the Ticket ID or name and try again.</div>';
  } else {
    results.innerHTML = visible.map(row => `
      <article class="participant">
        <h3 class="person-name">${escapeHTML(getValue(row,"full name") || "—")}</h3>
        <div class="person-meta">
          <span>Ticket ID: <b>${escapeHTML(getValue(row,"ticket id") || "—")}</b></span>
          <span>BIB Name: <b>${escapeHTML(getValue(row,"bib name") || "—")}</b></span>
          <span>Gender: <b>${escapeHTML(getValue(row,"gender") || "—")}</b></span>
          <span>T-Shirt: <b>${escapeHTML(getValue(row,"t-shirt size") || "—")}</b></span>
        </div>
        <p><span class="bib-chip">BIB ${escapeHTML(getValue(row,"bib number") || "—")}</span>
        <span class="person-meta">${escapeHTML(getValue(row,"category") || activeCategory)} ${getValue(row,"remark") ? " · " + escapeHTML(getValue(row,"remark")) : ""}</span></p>
      </article>`).join("");
  }
  const pages = Math.ceil(rows.length / PAGE_SIZE);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  if (pages > 1) {
    const addButton = (label, page, active=false, disabled=false) => {
      const button = document.createElement("button");
      button.className = "page-btn" + (active ? " active" : "");
      button.textContent = label; button.disabled = disabled;
      button.addEventListener("click", () => { currentPage = page; render(); });
      pagination.appendChild(button);
    };
    addButton("←", Math.max(1,currentPage-1), false, currentPage===1);
    for (let p=1; p<=pages; p++) {
      if (p===1 || p===pages || Math.abs(p-currentPage)<=1) addButton(String(p),p,p===currentPage);
      else if (Math.abs(p-currentPage)===2) {
        const dots=document.createElement("span"); dots.textContent="…"; dots.style.padding="9px 3px"; pagination.appendChild(dots);
      }
    }
    addButton("→", Math.min(pages,currentPage+1), false, currentPage===pages);
  }
}
document.querySelectorAll(".tab").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category; currentPage = 1;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab===button));
  render();
}));
document.getElementById("searchInput").addEventListener("input", () => { currentPage=1; render(); });
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("searchInput").value = ""; currentPage=1; render();
  document.getElementById("searchInput").focus();
});
const sponsorTrack = document.getElementById("sponsorTrack");
const sponsorSlots = Array.from({length:13}, (_,i)=>`<div class="sponsor-slot">SPONSOR ${String(i+1).padStart(2,"0")}</div>`).join("");
sponsorTrack.innerHTML = sponsorSlots + sponsorSlots;
loadData().catch(error => {
  console.error(error);
  document.getElementById("results").innerHTML = '<div class="empty">Could not load participant CSV files. Please open the website through GitHub Pages or a local web server, and check that all three CSV files are inside the assets folder.</div>';
  document.getElementById("resultCount").textContent = "Data loading error";
});