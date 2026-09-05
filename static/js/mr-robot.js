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

/* ---------- image / video fallback ---------- */
function mediaMissing(el){
  const wrap = el.closest(".rc-media");
  if (wrap) wrap.classList.add("missing");
}
window.mediaMissing = mediaMissing;

/* ---------- copy-to-clipboard for code blocks ---------- */
document.querySelectorAll(".rc-copy").forEach(btn => {
  btn.addEventListener("click", () => {
    const codeEl = document.getElementById(btn.dataset.target);
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      btn.textContent = "copied";
      btn.classList.add("copied");
      setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1500);
    });
  });
});

/* ---------- table of contents: click-to-scroll + mobile collapse ---------- */
const tocDetails = document.getElementById("toc-details");
const tocList = document.getElementById("toc-list");

tocList.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: "smooth" });
    if (window.innerWidth <= 900) tocDetails.open = false;
  });
});
tocDetails.open = window.innerWidth > 900;
window.addEventListener("resize", () => {
  tocDetails.open = window.innerWidth > 900;
});

/* ---------- scroll-spy: highlight the active TOC entry ---------- */
const tocLinks = tocList.querySelectorAll("a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const link = tocList.querySelector(`a[data-target="${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      tocLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}, { rootMargin: "-90px 0px -70% 0px", threshold: 0 });

document.querySelectorAll(".rc-h2").forEach(h => sectionObserver.observe(h));