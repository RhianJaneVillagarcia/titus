/* ===== EDIT ME: all the customizable text lives here ===== */
const CONFIG = {
  verdict: "OFFICIAL CLASSROOM VERDICT: THE CONFIDENCE IS UNDENIABLE. THE CASTING DIRECTOR HAS BEEN NOTIFIED… IN OUR IMAGINATION.",
  drumroll: ["AND THE VERDICT IS…", "3", "2", "1"],
  messages: [
    { who: "Your Classmates", text: "Thanks for always making us laugh, Titus!" },
    { who: "The Back Row", text: "Main character energy, every single day." },
    { who: "The Whole Class", text: "Coco who? Titus is our star." }
  ]
};

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---- Intro sequence ---- */
const intro = $("#intro");
document.body.style.overflow = "hidden";
function playIntro() {
  intro.className = "";
  intro.style.display = "";
  const bar = $("#bar i");
  bar.style.transition = "none"; bar.style.width = "0";
  const t = reduce ? 0 : 1;
  setTimeout(() => { bar.style.transition = `width ${1.6 * t}s`; bar.style.width = "100%"; }, 50);
  setTimeout(() => intro.classList.add("s1"), 1700 * t);
  setTimeout(() => intro.classList.add("s2"), 3000 * t);
  setTimeout(() => intro.classList.add("s3"), 4000 * t);
  $("#start").focus({ preventScroll: true });
}
$("#start").onclick = () => {
  intro.classList.add("gone");
  document.body.style.overflow = "";
  scrollTo(0, 0);
};
playIntro();

/* ---- Mobile menu ---- */
$("#menu").onclick = e => {
  const open = $("#links").classList.toggle("open");
  e.target.setAttribute("aria-expanded", open);
};
$$("#links a").forEach(a => a.onclick = () => $("#links").classList.remove("open"));

/* ---- Scroll reveals, meters, counters, finale ---- */
function animateCount(el) {
  const end = +el.dataset.count;
  if (reduce) { el.textContent = end; return; }
  const t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 1800, 1);
    el.textContent = Math.round(end * p);
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("in");
    $$("[data-v]", el).forEach(b => b.style.width = b.dataset.v + "%");
    $$("[data-count]", el).forEach(animateCount);
    io.unobserve(el);
  });
}, { threshold: 0.2 });
$$(".rv").forEach(el => io.observe(el));

/* ---- Finale ---- */
let finaleTimers = [];
function playFinale() {
  finaleTimers.forEach(clearTimeout); finaleTimers = [];
  const items = $$("#finale [data-d]");
  items.forEach(el => { el.classList.remove("show"); el.style.opacity = ""; });
  items.forEach(el => finaleTimers.push(setTimeout(() => {
    el.classList.add("show"); el.style.opacity = 1;
  }, reduce ? 0 : +el.dataset.d)));
}
new IntersectionObserver((en, ob) => {
  if (en[0].isIntersecting) { playFinale(); }
  else $$("#finale [data-d]").forEach(el => { el.classList.remove("show"); el.style.opacity = el.tagName === "BUTTON" ? 0 : ""; });
}, { threshold: 0.5 }).observe($("#finale"));
$("#replay").onclick = () => {
  scrollTo({ top: 0, behavior: "auto" });
  document.body.style.overflow = "hidden";
  playIntro();
};

/* ---- Coco comparison verdict ---- */
let revealing = false;
$("#reveal").onclick = () => {
  if (revealing) return;
  revealing = true;
  const drum = $("#drum"), out = $("#verdict");
  out.textContent = "";
  drum.classList.add("on");
  const steps = reduce ? [] : CONFIG.drumroll;
  steps.forEach((s, i) => setTimeout(() => drum.textContent = s, i * 900));
  setTimeout(() => {
    drum.classList.remove("on");
    $$("[data-cv]").forEach(b => {
      b.style.width = b.dataset.cv + "%";
      b.closest(".meter").querySelector("[data-cmp]").textContent = b.dataset.cv + "%";
    });
    typeText(out, CONFIG.verdict);
    revealing = false;
  }, steps.length * 900);
};
function typeText(el, text) {
  if (reduce) { el.textContent = text; return; }
  let i = 0;
  (function step() { el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 35); })();
}

/* ---- Appreciation wall ---- */
function addNote(who, text, prepend) {
  const d = document.createElement("div");
  d.className = "note";
  const p = document.createElement("p"), c = document.createElement("cite");
  p.textContent = text; c.textContent = "— " + who;   // textContent keeps user input safe
  d.append(p, c);
  prepend ? $("#notes").prepend(d) : $("#notes").append(d);
}
CONFIG.messages.forEach(m => addNote(m.who, m.text));
$("#noteForm").onsubmit = e => {
  e.preventDefault();
  addNote($("#who").value.trim(), $("#msg").value.trim(), true);
  e.target.reset();
};

/* ---- Background gold particles ---- */
const cv = $("#bg"), cx = cv.getContext("2d");
let W, H, parts = [];
function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
resize(); addEventListener("resize", resize);
if (!reduce) {
  parts = Array.from({ length: 45 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 2 + .5, s: Math.random() * .6 + .2 }));
  (function draw() {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = "rgba(232,184,74,.55)";
    parts.forEach(p => {
      p.y -= p.s; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.3); cx.fill();
    });
    requestAnimationFrame(draw);
  })();
}