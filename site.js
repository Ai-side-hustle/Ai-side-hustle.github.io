// fouad_ai site: the episode floors (home) and the motion. Everything works without it; it only adds.
document.documentElement.classList.add("js");
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ar = n => n.toLocaleString("ar-SA");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// home: six floors of episodes
const floors = document.querySelector(".floors");
if (floors && window.EPISODES) {
  const E = window.EPISODES, levels = [...new Set(E.map(e => e.level))];
  const no = l => (l.match(/المستوى ([^\s:]+)/) || [])[1], name = l => (l.split(": ")[1] || l).replace(/\s*\(.*\)/, "");
  const li = e => `<li class="${e.done ? "on" : ""}"><span class="n">${ar(e.n)}</span><span>${e.done ? `<a href="${esc(e.tt || e.yt)}">${esc(e.ar)}</a>` : esc(e.ar)}</span></li>`;
  floors.innerHTML = levels.map(l => {
    const es = E.filter(e => e.level === l), d = es.filter(e => e.done).length;
    return `<div class="floor"><h3>الدور ${no(l)}: ${esc(name(l))}</h3><div class="c">${ar(es.length)} حلقة · نزل منها ${ar(d)}</div><ol>${es.slice(0, 5).map(li).join("")}</ol>${
      es.length > 5 ? `<details><summary>و${ar(es.length - 5)} حلقات بعدها</summary><ol>${es.slice(5).map(li).join("")}</ol></details>` : ""}</div>`;
  }).join("");
  const first = E.find(e => e.n === 1);
  if (first?.done) document.getElementById("first").href = first.tt || first.yt;
}

// headline words rise one by one (keeps <em>)
document.querySelectorAll("h1").forEach(h => {
  let i = 0;
  [...h.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) return f.append(t);
        const s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", i++); s.textContent = t; f.append(s); });
      c.replaceWith(f);
    } else if (c.nodeType === 1) { c.classList.add("w"); c.style.setProperty("--i", i++); }
  });
  document.querySelectorAll(".rise").forEach((el, k) => el.style.setProperty("--d", (i * 70 + 250 + k * 120) + "ms"));
});

// sections rise as they come into view
const targets = document.querySelectorAll(".floor, .page article > *");
targets.forEach((el, k) => { el.dataset.reveal = ""; el.style.setProperty("--i", k % 6); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
targets.forEach(el => io.observe(el));

// start once the fonts are in (max 1.5 s), so the entrance is seen and not lost behind a font swap
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]).then(() => document.body.classList.add("play"));
