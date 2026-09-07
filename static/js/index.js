/* =========================================================
   EDIT THIS LIST to add / remove your own writeups.
   platform: "thm" (TryHackMe) or "vh" (VulnHub)
   difficulty: "easy" | "medium" | "hard" | "insane"
   url: link to your full writeup (markdown page, blog post, etc.)
   ========================================================= */
const WRITEUPS = [
  {
    slug: "blue",
    cover: "static/assets/covers/blue.jpg",
    title: "Blue",
    platform: "thm",
    difficulty: "easy",
    date: "2026-01-12",
    desc: "EternalBlue (MS17-010) against an unpatched Windows 7 box, from SMB enum to SYSTEM.",
    tags: ["smb", "eternalblue", "metasploit"],
    url: "#"
  },
  {
    slug: "kenobi",
    cover: "static/assets/covers/kenobi.jpg",
    title: "Kenobi",
    platform: "thm",
    difficulty: "easy",
    date: "2026-01-20",
    desc: "Samba enumeration, an anonymous FTP share, and a PATH hijack for root.",
    tags: ["samba", "ftp", "path-hijack"],
    url: "#"
  },
  {
    slug: "mr-robot",
    cover: "static/assets/covers/mr-robot.jpg",
    title: "Mr. Robot",
    platform: "thm",
    difficulty: "medium",
    date: "2026-05-19",
    creator: "Leon Johnson",
    room: "https://tryhackme.com/room/mrrobot",
    desc: "WordPress theme-editor reverse shell, an MD5 hash crack, and a SUID nmap privesc to root.",
    tags: ["wordpress", "john", "suid", "nmap"],
    url: "mr-robot.html"
  },
  {
    slug: "wonderland",
    cover: "static/assets/covers/wonderland.jpg",
    title: "Wonderland",
    platform: "thm",
    difficulty: "medium",
    date: "2026-02-15",
    desc: "A rabbit-hole heavy box: hidden directories, python library hijacking, and a setuid binary escape.",
    tags: ["ssti", "python", "setuid"],
    url: "#"
  },
  {
    slug: "dc-9",
    cover: "static/assets/covers/dc-9.jpg",
    title: "DC-9",
    platform: "vh",
    difficulty: "medium",
    date: "2026-03-01",
    desc: "SQL injection into admin creds, port knocking to reach SSH, and a weak-credential privesc chain.",
    tags: ["sqli", "port-knocking", "ssh"],
    url: "#"
  },
  {
    slug: "wreath-network",
    cover: "static/assets/covers/wreath-network.jpg",
    title: "Wreath Network",
    platform: "thm",
    difficulty: "hard",
    date: "2026-03-22",
    desc: "A three-box pivot chain using SSH tunnelling and Sliver C2 to move through an internal network.",
    tags: ["pivoting", "c2", "ssh-tunnel"],
    url: "#"
  },
  {
    slug: "sar",
    cover: "static/assets/covers/sar.jpg",
    title: "Sar",
    platform: "vh",
    difficulty: "easy",
    date: "2026-04-05",
    desc: "robots.txt leads to a vulnerable CMS endpoint, then a scheduled-job privesc to root.",
    tags: ["cms", "cron", "enumeration"],
    url: "#"
  },
  {
    slug: "wonderland2",
    cover: "static/assets/covers/wonderland2.jpg",
    title: "Wonderland2",
    platform: "vh",
    difficulty: "insane",
    date: "2026-04-18",
    desc: "Multi-stage chain combining a custom binary reverse engineer, a chained LFI, and kernel privesc.",
    tags: ["reversing", "lfi", "kernel-exploit"],
    url: "#"
  }
];

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- live EAT clock ---------- */
const clockEl = document.getElementById("clock-time");
const eatFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Nairobi",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
});
function updateClock(){
  clockEl.textContent = eatFormatter.format(new Date());
}
updateClock();
setInterval(updateClock, 1000);

/* ---------- header prompt: typing "cat root-flag.txt" on a loop ---------- */
const tcTypedEl = document.getElementById("tc-typed");
const TC_COMMAND = "cat root-flag.txt";
let tcIndex = 0, tcDeleting = false;

function tcTypeLoop(){
  if (!tcDeleting){
    tcIndex++;
    tcTypedEl.textContent = TC_COMMAND.slice(0, tcIndex);
    if (tcIndex === TC_COMMAND.length){
      tcDeleting = true;
      setTimeout(tcTypeLoop, 1600);
      return;
    }
  } else {
    tcIndex--;
    tcTypedEl.textContent = TC_COMMAND.slice(0, tcIndex);
    if (tcIndex === 0){
      tcDeleting = false;
      setTimeout(tcTypeLoop, 400);
      return;
    }
  }
  setTimeout(tcTypeLoop, tcDeleting ? 35 : 70);
}
tcTypeLoop();

/* ---------- render cards ---------- */
const grid = document.getElementById("card-grid");
const emptyState = document.getElementById("empty-state");
const platformLabel = { thm: "TryHackMe", vh: "VulnHub" };

function renderCards(list){
  grid.innerHTML = "";
  list.forEach(w => {
    const card = document.createElement("a");
    card.href = w.content ? `#w/${w.slug}` : w.url;
    card.className = "card";
    card.innerHTML = `
      <div class="card-top">
        <span class="platform-tag"><span class="platform-dot ${w.platform}"></span>${platformLabel[w.platform]}</span>
        <span class="difficulty ${w.difficulty}">${w.difficulty}</span>
      </div>
      <div class="card-cover-wrap">
        <img class="card-cover" src="${w.cover}" alt="${w.title} cover" onerror="this.closest('.card-cover-wrap').classList.add('missing')">
        <div class="card-cover-fallback">
          <strong>No cover image</strong>
          <small>expected at: ${w.cover}</small>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${w.title}</h3>
        <div class="tags">${w.tags.map(t => `<span class="tag">#${t}</span>`).join("")}</div>
        <div class="card-meta" style="margin-top:12px;"><span>${w.date}</span></div>
        <div class="card-cta">cat writeup.md <span class="arrow">&rarr;</span></div>
      </div>`;
    grid.appendChild(card);
  });
  emptyState.classList.toggle("show", list.length === 0);
}

function updateStats(){
  document.getElementById("stat-total").textContent = WRITEUPS.length;
  document.getElementById("stat-thm").textContent = WRITEUPS.filter(w => w.platform === "thm").length;
  document.getElementById("stat-vh").textContent = WRITEUPS.filter(w => w.platform === "vh").length;
}

let activeFilter = "all";
function applyFilters(){
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  const filtered = WRITEUPS.filter(w => {
    const matchesPlatform = activeFilter === "all" || w.platform === activeFilter;
    const haystack = (w.title + " " + w.tags.join(" ") + " " + w.desc).toLowerCase();
    const matchesQuery = q === "" || haystack.includes(q);
    return matchesPlatform && matchesQuery;
  });
  renderCards(filtered);
}

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});
document.getElementById("search-input").addEventListener("input", applyFilters);

updateStats();
renderCards(WRITEUPS);

/* ---------- writeup reader ---------- */
const reader = document.getElementById("reader");
const readerArticle = document.getElementById("reader-article");
const readerEyebrow = document.getElementById("reader-eyebrow");
const readerTitle = document.getElementById("reader-title");
const readerMeta = document.getElementById("reader-meta");
const readerTags = document.getElementById("reader-tags");
const tocList = document.getElementById("toc-list");
const tocDetails = document.getElementById("toc-details");

let sectionObserver = null;

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
}

function slugify(str){
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderBlock(block, i){
  switch(block.type){
    case "h2":
      return `<h2 class="rc-h2" id="${block.id}">${block.icon ? `<span class="h2-icon">${block.icon}</span>` : ""}${block.text}</h2>`;
    case "p":
      return `<p class="rc-p">${block.text}</p>`;
    case "list":
      return `<ul class="rc-list">${block.items.map(it => `<li>${it}</li>`).join("")}</ul>`;
    case "code":
      return `
        <div class="rc-code">
          <div class="rc-code-head">
            <span>${block.lang || "shell"}</span>
            <button class="rc-copy" data-code-index="${i}">copy</button>
          </div>
          <pre><code id="rc-code-${i}">${escapeHtml(block.code)}</code></pre>
        </div>`;
    case "image":
      return `
        <figure class="rc-media" id="rc-media-${i}">
          <div class="rc-media-frame">
            <img src="${block.src}" alt="${escapeHtml(block.alt || "")}" onerror="document.getElementById('rc-media-${i}').classList.add('missing')">
            <div class="rc-media-fallback">
              <strong>Image not found</strong>
              <small>expected at: ${escapeHtml(block.src)}</small>
            </div>
          </div>
          ${block.caption ? `<figcaption class="rc-caption">${escapeHtml(block.caption)}</figcaption>` : ""}
        </figure>`;
    default:
      return "";
  }
}

function openReader(slug){
  const w = WRITEUPS.find(x => x.slug === slug);
  if (!w || !w.content) return;

  // assign a stable id (+ keep any icon) to every heading, used by both the
  // article and the sidebar so clicking a TOC entry scrolls to the right spot
  let headingCount = 0;
  w.content.forEach(block => {
    if (block.type === "h2"){
      block.id = `sec-${slugify(block.text)}-${headingCount++}`;
    }
  });

  readerEyebrow.innerHTML = `
    <span class="platform-tag"><span class="platform-dot ${w.platform}"></span>${platformLabel[w.platform]}</span>
    <span class="difficulty ${w.difficulty}">${w.difficulty}</span>`;
  readerTitle.textContent = w.title;
  readerMeta.innerHTML = `
    <span>${w.date}</span>
    ${w.creator ? `<span>by ${escapeHtml(w.creator)}</span>` : ""}
    ${w.room ? `<a href="${w.room}" target="_blank" rel="noopener">room link &rarr;</a>` : ""}`;
  readerTags.innerHTML = w.tags.map(t => `<span class="tag">#${t}</span>`).join("");
  readerArticle.innerHTML = w.content.map(renderBlock).join("");

  const headings = w.content.filter(b => b.type === "h2");
  tocList.innerHTML = headings.map(h =>
    `<a href="#${h.id}" data-target="${h.id}"><span class="toc-icon">${h.icon || "&bull;"}</span>${h.text}</a>`
  ).join("");
  tocDetails.open = window.innerWidth > 900;

  readerArticle.querySelectorAll(".rc-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.codeIndex;
      const codeEl = document.getElementById(`rc-code-${idx}`);
      navigator.clipboard.writeText(codeEl.textContent).then(() => {
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1500);
      });
    });
  });

  tocList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: "smooth" });
      if (window.innerWidth <= 900) tocDetails.open = false;
    });
  });

  if (sectionObserver) sectionObserver.disconnect();
  const tocLinks = tocList.querySelectorAll("a");
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = tocList.querySelector(`a[data-target="${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-90px 0px -70% 0px", threshold: 0 });
  readerArticle.querySelectorAll(".rc-h2").forEach(h => sectionObserver.observe(h));

  document.body.classList.add("reading");
  reader.classList.add("open");
  window.scrollTo(0, 0);
}

function closeReader(){
  document.body.classList.remove("reading");
  reader.classList.remove("open");
  if (location.hash.startsWith("#w/")){
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}

function handleHash(){
  const hash = location.hash;
  if (hash.startsWith("#w/")){
    openReader(hash.slice(3));
  } else {
    document.body.classList.remove("reading");
    reader.classList.remove("open");
  }
}

document.getElementById("reader-back").addEventListener("click", closeReader);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && reader.classList.contains("open")) closeReader();
});
window.addEventListener("hashchange", handleHash);
handleHash();

/* ---------- hero terminal typing ---------- */
const lines = [
  "cat motd.txt",
  "ls -la ./writeups/",
  "grep -r 'root' --include=*.md | wc -l"
];
const typedEl = document.getElementById("typed-line");
let li = 0, ci = 0, deleting = false;

function typeLoop(){
  const current = lines[li];
  if (!deleting){
    ci++;
    typedEl.textContent = current.slice(0, ci);
    if (ci === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    ci--;
    typedEl.textContent = current.slice(0, ci);
    if (ci === 0){
      deleting = false;
      li = (li + 1) % lines.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}
typeLoop();

/* ---------- matrix rain background ---------- */
const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");
let cols, drops, nameCols;
const glyphs = "01アイウエオカキクケコサシスセソ$#@%&";
const SIGNATURE = "Sh4d0wSpl01t".split("");

function sizeCanvas(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  cols = Math.floor(canvas.width / 16);
  drops = new Array(cols).fill(0);
  // pick a scattered subset of columns to spell out the signature as they fall
  nameCols = new Map();
  for (let i = 0; i < cols; i++){
    if (Math.random() < 0.11){
      nameCols.set(i, Math.floor(Math.random() * SIGNATURE.length));
    }
  }
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function drawMatrix(){
  ctx.fillStyle = "rgba(6,10,8,0.10)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "14px monospace";
  for (let i = 0; i < drops.length; i++){
    let text;
    if (nameCols.has(i)){
      const idx = nameCols.get(i);
      text = SIGNATURE[idx % SIGNATURE.length];
      nameCols.set(i, idx + 1);
      ctx.fillStyle = "#eafff2";
      ctx.shadowColor = "#00ff6a";
      ctx.shadowBlur = 6;
    } else {
      text = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillStyle = "#00ff6a";
      ctx.shadowBlur = 0;
    }
    ctx.fillText(text, i * 16, drops[i] * 16);
    ctx.shadowBlur = 0;
    if (drops[i] * 16 > canvas.height && Math.random() > 0.975){
      drops[i] = 0;
      if (nameCols.has(i) && Math.random() < 0.5){
        nameCols.set(i, Math.floor(Math.random() * SIGNATURE.length));
      } else if (Math.random() < 0.11){
        nameCols.set(i, 0);
      } else {
        nameCols.delete(i);
      }
    }
    drops[i]++;
  }
}
if (!reduceMotion){
  setInterval(drawMatrix, 60);
} else {
  ctx.fillStyle = "rgba(0,255,106,0.04)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
