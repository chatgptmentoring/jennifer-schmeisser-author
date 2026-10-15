/* ==========================================================================
   Site behaviour: header, menu, config wiring, modals, demo forms,
   reveal-on-scroll, tip shuffler, typewriter, copy buttons.
   ========================================================================== */
(function () {
  "use strict";

  window.__siteReady = true;
  const CFG = window.SITE_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Active nav ---------- */
  const page = document.body.dataset.page;
  $$("[data-nav]").forEach(a => { if (a.dataset.nav === page) a.setAttribute("aria-current", "page"); });

  /* ---------- Header shadow on scroll ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobile-menu");
  const openBtn = $("[data-menu-open]");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    if (open) { const first = $("nav a", menu); first && first.focus({ preventScroll: true }); }
    else if (openBtn) openBtn.focus({ preventScroll: true });
  }
  openBtn && openBtn.addEventListener("click", () => setMenu(true));
  $$("[data-menu-close]").forEach(b => b.addEventListener("click", () => setMenu(false)));
  menu && $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Social icons + email ---------- */
  const SOCIAL_META = {
    facebook: ["Facebook", "#i-facebook"],
    instagram: ["Instagram", "#i-instagram"],
    linkedin: ["LinkedIn", "#i-linkedin"],
    threads: ["Threads", "#i-threads"]
  };
  const socials = CFG.socials || {};
  $$("[data-socials]").forEach(wrap => {
    const items = Object.keys(SOCIAL_META).filter(k => socials[k]).map(k => {
      const [label, icon] = SOCIAL_META[k];
      return `<a class="social-btn" href="${socials[k]}" target="_blank" rel="noopener" aria-label="${label}"><svg class="icon" aria-hidden="true"><use href="${icon}"/></svg></a>`;
    });
    if (CFG.email) items.push(`<a class="social-btn" href="mailto:${CFG.email}" aria-label="Email"><svg class="icon" aria-hidden="true"><use href="#i-mail"/></svg></a>`);
    wrap.innerHTML = items.join("");
  });
  $$("[data-social-link]").forEach(a => { const u = socials[a.dataset.socialLink]; if (u) a.href = u; });
  $$("[data-email]").forEach(el => { el.textContent = CFG.email || ""; });
  $$("[data-email-link]").forEach(a => { if (CFG.email) a.href = "mailto:" + CFG.email; });
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Book purchase buttons ---------- */
  const book = CFG.book || {};
  const live = !!book.amazonUrl;
  $$("[data-launch-note]").forEach(el => { el.textContent = live ? "Available now on Amazon" : (book.launchNote || "Coming soon"); });
  $$("[data-buy-label]").forEach(el => { el.textContent = live ? "Buy on Amazon" : "Get it on Amazon"; });
  $$("[data-buy-tag]").forEach(el => { el.hidden = live; });
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-buy]");
    if (!btn) return;
    if (live) {
      e.preventDefault();
      window.open(book.amazonUrl, "_blank", "noopener");
    } else {
      e.preventDefault();
      openModal("notify");
    }
  });

  /* ---------- Modals ---------- */
  let lastFocus = null;
  function openModal(id) {
    const m = document.getElementById("modal-" + id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add("open"));
    document.body.style.overflow = "hidden";
    setTimeout(() => { const f = $("input, button.btn, a.btn", m); f && f.focus({ preventScroll: true }); }, 60);
  }
  function closeModal(m) {
    m.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { m.hidden = true; }, 260);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  window.SiteModal = { open: openModal };
  document.addEventListener("click", e => {
    const opener = e.target.closest("[data-modal-open]");
    if (opener) { e.preventDefault(); openModal(opener.dataset.modalOpen); return; }
    const closer = e.target.closest("[data-modal-close]");
    if (closer) { const m = closer.closest(".modal"); m && closeModal(m); }
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const m = $(".modal.open");
    if (m) closeModal(m);
    else if (menu && menu.classList.contains("open")) setMenu(false);
  });

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  window.SiteToast = toast;

  /* ---------- Demo forms ---------- */
  $$("form[data-demo-form]").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const btn = $("button[type=submit]", form);
      if (btn) { btn.disabled = true; btn.style.opacity = .7; }
      if (CFG.formEndpoint) {
        try { await fetch(CFG.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }); } catch (_) { /* keep going: show thanks */ }
      } else {
        await new Promise(r => setTimeout(r, 650));
      }
      form.classList.add("sent");
    });
  });

  /* Preselect the contact topic from ?topic= */
  const topicSel = $("[data-topic-select]");
  if (topicSel) {
    const t = new URLSearchParams(location.search).get("topic");
    if (t && $(`option[value="${CSS.escape(t)}"]`, topicSel)) topicSel.value = t;
  }

  /* ---------- Resource download → gentle book nudge ---------- */
  $$("[data-resource-download]").forEach(a => {
    a.addEventListener("click", () => {
      let shown = false;
      try { shown = sessionStorage.getItem("thanks-shown") === "1"; } catch (_) {}
      if (shown) { toast("💛 Enjoy your free guide!"); return; }
      try { sessionStorage.setItem("thanks-shown", "1"); } catch (_) {}
      setTimeout(() => openModal("thanks"), 700);
    });
  });

  /* ---------- Copy buttons ---------- */
  $$("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const src = $(btn.dataset.copy);
      if (!src) return;
      const text = src.innerText.trim();
      try { await navigator.clipboard.writeText(text); toast("✓ Bio copied to clipboard"); }
      catch (_) {
        const r = document.createRange(); r.selectNodeContents(src);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        toast("Selected. Press Ctrl/Cmd + C to copy");
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
    // Belt and braces: some in-app browsers throttle IntersectionObserver.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight * 0.96;
      reveals.forEach(el => { if (!el.classList.contains("in") && el.getBoundingClientRect().top < limit) el.classList.add("in"); });
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }, { passive: true });
    window.addEventListener("load", sweep);
    setTimeout(sweep, 1200);
  }

  /* ---------- Typewriter (hero) ---------- */
  // Letters are pre-laid-out (invisible) and revealed one by one, so nothing reflows.
  const tw = $("[data-typewriter]");
  if (tw && !reduceMotion) {
    const full = tw.dataset.typewriter;
    tw.setAttribute("aria-label", full);
    tw.innerHTML = Array.from(full).map(ch => `<span class="tc" aria-hidden="true">${ch === " " ? " " : ch}</span>`).join("");
    const chars = $$(".tc", tw);
    let i = 0;
    setTimeout(function type() {
      if (i > 0) chars[i - 1].classList.remove("cur");
      chars[i].classList.add("on", "cur");
      i++;
      if (i < chars.length) setTimeout(type, 38 + Math.random() * 50);
      else setTimeout(() => chars[i - 1].classList.remove("cur"), 2400);
    }, 900);
  }

  /* ---------- Sparkle & Sanity tip shuffler ---------- */
  const TIPS = [
    ["✨ The Sparkle Tip", "That moment after the diagnosis? You don't have to understand it. You don't have to fix it. You just have to breathe and be.", "Chapter 1 · Diagnosis Day"],
    ["☕ The Sanity Tip", "Avoid Googling symptoms at 2 a.m. unless you enjoy spiraling into a WebMD wormhole that ends with you diagnosing your child (and yourself) with 14 new conditions.", "Chapter 1 · Diagnosis Day"],
    ["✨ The Sparkle Tip", "It is okay to grieve a life you imagined, even while fiercely loving the life you have. Humans cry. Then we wipe our faces and make dinner.", "Chapter 2 · Grieving the Blueprint"],
    ["☕ The Sanity Tip", "If something mysteriously vanishes, check the vents, the freezer, the bathtub, and inside any toy large enough to serve as a portal to the underworld.", "Chapter 3 · The Vanishing Wedding Ring"],
    ["✨ The Sparkle Tip", "Become unembarrassable. When you stop fearing judgment, you strip the world of its power to hurt you. Let them stare. You are busy loving your child.", "Chapter 6 · Meltdowns in Aisle 10"],
    ["☕ The Sanity Tip", "Keep a “Go Bag”: a fully charged iPad, noise-canceling headphones, and the emergency snack. When the meltdown starts, don't negotiate. Deploy the assets.", "Chapter 6 · Meltdowns in Aisle 10"],
    ["🚀 The Micro-Mission", "The 125% Ask: rewrite your next request for support. Ask for more than you think you'll get, and leave yourself room to negotiate.", "Chapter 7 · When the IEP Feels Like an FBI Interrogation"],
    ["✨ The Sparkle Tip", "Self-care is strategy, not indulgence. Stop treating your body worse than you treat a Honda Civic.", "Chapter 11 · The German Doctor"],
    ["☕ The Sanity Tip", "The 8 PM Shutdown. When the alarm goes off, the “Office of Mom” is closed. No forms. No emails. No Googling therapies.", "Chapter 11 · The German Doctor"],
    ["🚀 The Micro-Mission", "The “Hot Coffee” Promise: drink your beverage while it's the correct temperature, even if that means hiding in the pantry for four minutes.", "Chapter 12 · Sleep Is for the Privileged"],
    ["☕ The Sanity Tip", "Camouflage is key. Put the snacks in Tupperware and the milk in opaque bottles. Hide the visual trigger, and you often turn off the behavioral alarm.", "Chapter 15 · Milk All Gone"],
    ["✨ The Sparkle Tip", "Pajamas before 8 PM = self-care, not surrender. The sticky will still be there tomorrow, and so will your strength.", "Chapter 16 · Chaos & Cornering"],
    ["☕ The Sanity Tip", "Rig the deck. Tuck extra Jacks in the Slapjack pile. The goal of play isn't to enforce regulations. The goal of play is connection and joy.", "Chapter 17 · Tiny Joys, Huge Victories"],
    ["✨ The Sparkle Tip", "Tiny joys ARE huge victories. If it feels like a victory to you, it is a victory. Celebrate it loudly.", "Chapter 17 · Tiny Joys, Huge Victories"],
    ["☕ The Sanity Tip", "Takeout is cheaper than therapy. Buy the pizza. Eat the cereal. Lower the bar. Your sanity is worth more than a perfect home-cooked meal.", "Chapter 10 · The Messy Middle"]
  ];
  const tipBox = $("[data-tip-box]");
  if (tipBox) {
    let idx = 0;
    const tType = $("[data-tip-type]", tipBox), tText = $("[data-tip-text]", tipBox), tFrom = $("[data-tip-from]", tipBox);
    $("[data-tip-shuffle]", tipBox).addEventListener("click", () => {
      let n; do { n = Math.floor(Math.random() * TIPS.length); } while (n === idx);
      idx = n;
      tText.classList.add("swap");
      setTimeout(() => {
        tType.textContent = TIPS[idx][0];
        tText.textContent = TIPS[idx][1];
        tFrom.textContent = "From " + TIPS[idx][2];
        tText.classList.remove("swap");
      }, 220);
    });
  }
})();
