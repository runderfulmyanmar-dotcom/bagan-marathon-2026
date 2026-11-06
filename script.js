// Bagan Marathon 2026 — participant list and sponsor logos
const DATA_FILES = {
  "10KM": "assets/10Km.csv",
  "21KM": "assets/21Km.csv",
  "42KM": "assets/42Km.csv"
};
const PAGE_SIZE = 20;
const SPONSOR_COUNT = 20;
let allData = {};
let activeCategory = "10KM";
let currentPage = 1;

function parseCSV(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { field += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(field); field = ""; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++;
      row.push(field); field = "";
      if (row.some(v => v.trim())) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field); if (row.some(v => v.trim())) rows.push(row);
  if (!rows.length) return [];
  const headers = rows.shift().map(h => h.trim().replace(/^\uFEFF/, "").toLowerCase());
  return rows.map(values => { const item = {}; headers.forEach((h, i) => item[h] = (values[i] || "").trim()); return item; });
}
function val(row, key) {
  const keys = {"ticket id":["ticket id"],"full name":["full name"],"bib name":["bib name"],"bib number":["bib number"],gender:["gender"],category:["category"],"t-shirt size":["t-shirt size","t-shirt size","t shirt size"],remark:["remark"]};
  for (const k of (keys[key] || [key])) if (row[k] !== undefined) return row[k];
  return "";
}
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function hasSearch() { return Boolean(document.getElementById("ticketSearch").value.trim() || document.getElementById("nameSearch").value.trim()); }
function categoryTone() { return activeCategory === "10KM" ? "tone-orange" : activeCategory === "21KM" ? "tone-navy" : "tone-sand"; }
function filteredRows() {
  const ticket = document.getElementById("ticketSearch").value.trim().toLowerCase();
  const name = document.getElementById("nameSearch").value.trim().toLowerCase();
  return (allData[activeCategory] || []).filter(row =>
    (!ticket || val(row,"ticket id").toLowerCase().includes(ticket)) &&
    (!name || [val(row,"full name"), val(row,"bib name")].join(" ").toLowerCase().includes(name))
  );
}
function renderCard(row) {
  return `<article class="participant-card ${categoryTone()}">
    <div class="bib-panel"><span class="bib-label">RACE BIB</span><strong class="bib-number">${esc(val(row,"bib number") || "—")}</strong><span class="bib-tag">${esc(val(row,"category") || activeCategory)}</span></div>
    <div class="person-info"><h3 class="person-name">${esc(val(row,"full name") || "Name not provided")}</h3>
      <div class="bib-name">BIB Name: <b>${esc(val(row,"bib name") || "—")}</b></div>
      <div class="person-details"><span>Ticket ID: <b>${esc(val(row,"ticket id") || "—")}</b></span><span>Gender: <b>${esc(val(row,"gender") || "—")}</b></span><span>T-Shirt: <b>${esc(val(row,"t-shirt size") || "—")}</b></span><span>Remark: <b>${esc(val(row,"remark") || "—")}</b></span></div>
      <span class="category-chip">${esc(val(row,"category") || activeCategory)} PARTICIPANT</span>
    </div></article>`;
}
function renderListRow(row, number) {
  return `<article class="participant-list-row"><span class="list-index">${number}</span><strong class="list-bib ${categoryTone()}">${esc(val(row,"bib number") || "—")}</strong><span class="list-name"><b>${esc(val(row,"full name") || "Name not provided")}</b><small>${esc(val(row,"bib name") || "—")}</small></span><span class="list-ticket"><small>TICKET ID</small><b>${esc(val(row,"ticket id") || "—")}</b></span><span class="list-gender">${esc(val(row,"gender") || "—")}</span><span class="list-size">${esc(val(row,"t-shirt size") || "—")}</span></article>`;
}
function render() {
  const rows = filteredRows(), pages = Math.ceil(rows.length / PAGE_SIZE);
  if (pages && currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * PAGE_SIZE, shown = rows.slice(start, start + PAGE_SIZE), searching = hasSearch();
  const host = document.getElementById("results");
  document.getElementById("resultCount").textContent = searching ? (rows.length ? "Search Results" : "No Matching Participants") : "Official Participant List";
  document.getElementById("activeCategoryLabel").textContent = `${activeCategory.replace("KM", " KM")} PARTICIPANTS`;
  if (!shown.length) {
    host.className = "results-grid " + (searching ? "search-card-mode" : "list-mode");
    host.innerHTML = '<div class="empty">No participant found. Please check your search details and try again.</div>';
  } else if (searching) {
    host.className = "results-grid search-card-mode";
    host.innerHTML = shown.map(renderCard).join("");
  } else {
    host.className = "results-grid list-mode";
    host.innerHTML = '<div class="participant-list-head"><span>No.</span><span>BIB NO.</span><span>PARTICIPANT NAME</span><span>TICKET ID</span><span>GENDER</span><span>SIZE</span></div>' + shown.map((r,i) => renderListRow(r,start+i+1)).join("");
  }
  const pager = document.getElementById("pagination"); pager.innerHTML = "";
  if (pages > 1) {
    const add = (label,page,active=false,disabled=false) => { const b=document.createElement("button"); b.className="page-btn"+(active?" active":""); b.textContent=label; b.disabled=disabled; b.onclick=()=>{currentPage=page;render();document.getElementById("participants").scrollIntoView({behavior:"smooth",block:"start"});}; pager.appendChild(b); };
    add("←",Math.max(1,currentPage-1),false,currentPage===1);
    for(let p=1;p<=pages;p++){if(p===1||p===pages||Math.abs(p-currentPage)<=1)add(String(p),p,p===currentPage);else if(Math.abs(p-currentPage)===2){const d=document.createElement("span");d.textContent="…";d.className="page-dots";pager.appendChild(d);}}
    add("→",Math.min(pages,currentPage+1),false,currentPage===pages);
  }
}
async function loadData() {
  await Promise.all(Object.entries(DATA_FILES).map(async ([category,url]) => { const response=await fetch(url); if(!response.ok)throw Error(`Could not load ${url}`); allData[category]=parseCSV(await response.text()); }));
  render();
}
// Thirteen sponsor images: assets/logo-1.png ... assets/logo-13.png.
function setupSponsors() {
  const track=document.getElementById("sponsorTrack");
  const makeLogo=(i)=>`<div class="sponsor-slot"><img src="assets/logo-${i}.png" alt="Sponsor logo ${i}" loading="lazy"><span class="logo-fallback">SPONSOR ${i}</span></div>`;
  const oneSet=Array.from({length:SPONSOR_COUNT},(_,i)=>makeLogo(i+1)).join("");
  track.innerHTML=oneSet+oneSet;
  track.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{img.style.display="none";img.nextElementSibling.style.display="block";}));
}
document.querySelectorAll(".distance-card").forEach(button=>button.addEventListener("click",()=>{activeCategory=button.dataset.category;currentPage=1;document.querySelectorAll(".distance-card").forEach(item=>item.classList.toggle("active",item===button));render();document.getElementById("participants").scrollIntoView({behavior:"smooth",block:"start"});}));
["ticketSearch","nameSearch"].forEach(id=>document.getElementById(id).addEventListener("input",()=>{currentPage=1;render();}));
document.getElementById("clearBtn").addEventListener("click",()=>{["ticketSearch","nameSearch"].forEach(id=>document.getElementById(id).value="");currentPage=1;render();document.getElementById("ticketSearch").focus();});
setupSponsors();
loadData().catch(error=>{console.error(error);document.getElementById("results").innerHTML='<div class="empty">Participant CSV files could not be loaded. Please keep all three CSV files inside the assets folder and open the website through Live Server or GitHub Pages.</div>';document.getElementById("resultCount").textContent="Unable to Load Participant Data";});
