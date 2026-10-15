/* ==========================================================================
   SPARKLE: AI book companion (demo engine + chat UI)
   Floating panel on every page, inline on ask.html. Conversation persists
   across pages for the session. Answers come from sparkle-kb.js unless
   SITE_CONFIG.ai.endpoint is set (production LLM backend).
   ========================================================================== */
(function () {
  "use strict";

  const KB = window.SPARKLE_KB;
  const CFG = window.SITE_CONFIG || {};
  if (!KB) return;

  const AV = "assets/img/sparkle-avatar.webp";
  const STORE = "sparkle-chat-v1";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const isAsk = document.body.dataset.page === "ask";
  const $ = (s, el = document) => el.querySelector(s);
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ---------------- Text matching ---------------- */
  const norm = s => " " + String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9'\s]+/g, " ").replace(/\s+/g, " ").trim() + " ";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function compile(p) {
    const whole = p.endsWith("$");
    const t = norm(whole ? p.slice(0, -1) : p).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(?:^|\\s)" + t + (whole ? "(?=\\s|$)" : ""));
  }
  const compileAll = list => list.map(([p, w]) => [compile(p), w]);
  const score = (rxs, t) => rxs.reduce((s, [r, w]) => s + (r.test(t) ? w : 0), 0);

  const INTENTS = KB.intents.map(it => Object.assign({}, it, { rx: compileAll(it.patterns) }));
  const INTENT_BY_ID = Object.fromEntries(INTENTS.map(it => [it.id, it]));
  const STORY_RX = Object.fromEntries(Object.entries(KB.stories).map(([id, st]) => [id, compileAll(st.keys || [])]));
  const STORY_REQ = compileAll([["story", 5], ["stories", 5], ["anecdote", 5], ["funny", 4], ["make me laugh", 6], ["laugh$", 3], ["joke", 4], ["cheer me up", 6], ["make me smile", 6], ["something uplifting", 6], ["heartwarming", 6], ["heart warming", 6], ["sweet story", 6], ["inspiring", 4], ["something happy", 5], ["lighten", 4]]);
  const HEART_RX = /(heartwarming|heart warming|uplifting|sweet|inspiring|touching|happy|hope)/;
  const FUNNY_RX = /(funny|laugh|joke|cheer|smile|lighten|silly|hilarious)/;
  const AFFIRM_RX = /^\s*(yes|yeah|yep|yup|sure|ok|okay|please|absolutely|definitely|of course|go ahead|tell me|i'd love|i would love|why not|do it|let's do it|lets do it|sounds good)\b/;
  const CRISIS_RX = /(suicid|kill myself|killing myself|end my life|end it all|want to die|wanna die|don't want to live|dont want to live|do not want to live|hurt myself|harm myself|self harm myself|can't go on|cant go on|no reason to live|better off without me|overdose)/;
  const EMERGENCY_RX = /(emergency|in danger right now|call 911|being hurt right now)/;

  /* ---------------- Conversation state ---------------- */
  let ctx = { turns: 0, bookShownAt: -99, offer: null, storiesTold: [], resShown: [], fallbackN: 0, history: [] };

  /* ---------------- Brain ---------------- */
  function respond(text) {
    const t = norm(text);
    ctx.turns++;

    if (CRISIS_RX.test(t) || EMERGENCY_RX.test(t)) { ctx.offer = null; return Object.assign({ _id: "crisis" }, KB.crisis, { cards: [{ type: "crisis" }] }); }

    let bestStory = null, bestStoryScore = 0;
    for (const id in STORY_RX) { const s = score(STORY_RX[id], t); if (s > bestStoryScore) { bestStoryScore = s; bestStory = id; } }
    let bestIntent = null, bestIntentScore = 0;
    for (const it of INTENTS) { const s = score(it.rx, t); if (s > bestIntentScore) { bestIntentScore = s; bestIntent = it; } }
    const storyReq = score(STORY_REQ, t);

    // Accepting an offer ("Yes, tell me!")
    const offer = ctx.offer;
    ctx.offer = null;
    if (offer && (AFFIRM_RX.test(t) || (/(story|that one)/.test(t) && bestStoryScore < 4 && bestIntentScore < 4))) {
      if (bestIntent && bestIntent.id === "no") return intentReply(bestIntent);
      return offer === "breathe" ? intentReply(INTENT_BY_ID.breathe) : storyReply(offer, true);
    }

    if (bestStory && bestStoryScore >= 4 && bestStoryScore >= bestIntentScore - 1) return storyReply(bestStory);
    if (storyReq >= 4 && storyReq >= bestIntentScore) return storyReply(chooseStory(t));
    if (bestIntent && bestIntentScore >= 2) return intentReply(bestIntent);
    return fallbackReply();
  }

  function chooseStory(t) {
    const tone = FUNNY_RX.test(t) ? "funny" : HEART_RX.test(t) ? "heart" : null;
    let pool = Object.keys(KB.stories).filter(id => (!tone || KB.stories[id].tone === tone));
    let fresh = pool.filter(id => !ctx.storiesTold.includes(id));
    if (!fresh.length) { ctx.storiesTold = ctx.storiesTold.filter(id => !pool.includes(id)); fresh = pool; }
    return pick(fresh);
  }

  function storyReply(id, accepted) {
    const st = KB.stories[id];
    if (!ctx.storiesTold.includes(id)) ctx.storiesTold.push(id);
    const intro = accepted
      ? pick(["Oh, I love this one. 💛", "Okay, grab your coffee. ☕ Here's how Jennifer tells it:", "Settle in. This one's a favorite:"])
      : pick(["Ooh, good one. Here's how Jennifer tells it: 💛", "Okay, grab your coffee. ☕", "This one never fails to make me smile:", "You're going to love this one:"]);
    const r = { _id: "story:" + id, text: [intro], story: id, chips: ["Another story, please", "Get the book", "What's the book about?"] };
    const cards = [];
    if (ctx.turns - ctx.bookShownAt >= 2) cards.push({ type: "book", note: KB.bookNotes[ctx.storiesTold.length % KB.bookNotes.length] });
    r.cards = cards;
    return r;
  }

  function intentReply(it) {
    const base = typeof it.reply === "function" ? it.reply(ctx, CFG) : it.reply;
    const r = Object.assign({ _id: it.id }, base);
    const cards = [];
    if (r.offer) ctx.offer = r.offer;

    // Breathing / crisis
    if (r.breathe) cards.push({ type: "breathe" });
    if (r.links) cards.push({ type: "links", items: r.links });

    // The book always comes first
    const bookNote = r.book || it.book;
    const since = ctx.turns - ctx.bookShownAt;
    if (bookNote) {
      cards.push({ type: "book", note: typeof bookNote === "string" ? bookNote : null });
    } else if (!r.noCta && !it.noCta && !r.offer && it.chapter && ctx.turns >= 2 && since >= 3) {
      cards.push({ type: "book", note: `This comes straight from ${it.chapter} of the book, where Jennifer tells the whole story.` });
    }

    // Free resources (secondary)
    if (r.resourcesAll) {
      Object.keys(KB.resources).forEach(id => cards.push({ type: "res", id, quiet: true }));
    } else {
      [it.resource, r.extraResource || it.extraResource].filter(Boolean).forEach(id => {
        if (!ctx.resShown.includes(id)) cards.push({ type: "res", id, label: "🎁 A free gift that pairs with this" });
      });
    }

    // Chips
    let chips = (r.chips || []).slice();
    if (r.extraChips) chips = r.extraChips.concat(chips);
    if (r.offer && KB.stories[r.offer]) chips = [{ label: KB.stories[r.offer].chip, gold: true }, "Maybe later"].concat(chips.slice(0, 2));
    r.chips = chips;
    r.cards = cards;
    return r;
  }

  function fallbackReply() {
    const r = Object.assign({ _id: "fallback" }, KB.fallback[ctx.fallbackN % KB.fallback.length]);
    ctx.fallbackN++;
    r.cards = [];
    return r;
  }

  /* ---------------- Remote (production) engine ---------------- */
  async function remoteRespond(text) {
    const res = await fetch(CFG.ai.endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: ctx.history.slice(-12) })
    });
    if (!res.ok) throw new Error("AI endpoint error");
    const data = await res.json();
    const paras = String(data.text || "").split(/\n{2,}/).map(p => esc(p).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>"));
    return { text: paras, chips: data.chips || [], cards: data.showBook ? [{ type: "book" }] : [] };
  }

  /* ---------------- UI ---------------- */
  let root, log, input, sendBtn, panel, launcher, bubble, busy = false, opened = false;

  function chatShell(mode) {
    return `
      <div class="chat-head">
        <span class="av"><img src="${AV}" alt="" width="44" height="44"></span>
        <span class="who"><b>Sparkle <span class="demo-pill">Demo</span></b><small>AI book companion · built from Jennifer's book</small></span>
        <button class="h-btn" type="button" data-sp-reset title="Start over" aria-label="Start a new conversation"><svg class="icon" aria-hidden="true"><use href="#i-refresh"/></svg></button>
        ${mode === "panel" ? `
        <a class="h-btn" href="ask.html" data-sp-expand title="Open full page" aria-label="Open Sparkle on its own page"><svg class="icon" aria-hidden="true"><use href="#i-expand"/></svg></a>
        <button class="h-btn" type="button" data-sp-close aria-label="Close chat"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>` : ""}
      </div>
      <div class="chat-log" role="log" aria-live="polite" aria-label="Conversation with Sparkle"></div>
      <div class="chat-input">
        <form class="chat-form" autocomplete="off">
          <label class="sr-only" for="sp-input-${mode}">Message Sparkle</label>
          <textarea id="sp-input-${mode}" rows="1" maxlength="600" placeholder="Ask Sparkle anything…"></textarea>
          <button type="submit" aria-label="Send message"><svg class="icon" aria-hidden="true"><use href="#i-send"/></svg></button>
        </form>
        <p class="chat-disclaimer">AI demo inspired by Jennifer's book · Not medical, legal, or therapeutic advice</p>
      </div>`;
  }

  function mount() {
    const inline = $("#sparkle-inline");
    if (inline) {
      root = inline;
      root.innerHTML = chatShell("inline");
    } else {
      panel = document.createElement("div");
      panel.className = "sparkle-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-label", "Chat with Sparkle, the AI book companion");
      panel.innerHTML = chatShell("panel");
      document.body.appendChild(panel);
      root = panel;

      launcher = document.createElement("button");
      launcher.type = "button";
      launcher.className = "sparkle-launcher";
      launcher.setAttribute("aria-label", "Open Sparkle, the AI book companion");
      launcher.innerHTML = `<span class="pulse" aria-hidden="true"></span><img src="${AV}" alt="" width="42" height="42"><span class="l-text">Ask Sparkle<small>AI book companion</small></span>`;
      launcher.addEventListener("click", () => open());
      document.body.appendChild(launcher);

      bubble = document.createElement("div");
      bubble.className = "sparkle-bubble";
      bubble.innerHTML = `<button class="x" type="button" aria-label="Dismiss"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>Hi! I'm <b>Sparkle</b> 🦄, Jennifer's AI book companion. Ask me anything, or let me tell you a funny story.`;
      bubble.addEventListener("click", e => {
        if (e.target.closest(".x")) { dismissBubble(); return; }
        open(); dismissBubble();
      });
      document.body.appendChild(bubble);
      let dismissed = false;
      try { dismissed = sessionStorage.getItem("sparkle-bubble") === "1"; } catch (_) {}
      if (!dismissed && !loadState()) setTimeout(() => { if (!opened) bubble.classList.add("show"); }, 6500);
    }

    log = $(".chat-log", root);
    input = $("textarea", root);
    sendBtn = $(".chat-form button", root);

    $(".chat-form", root).addEventListener("submit", e => { e.preventDefault(); submit(); });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } });
    input.addEventListener("input", autosize);
    $("[data-sp-reset]", root).addEventListener("click", reset);
    const closeBtn = $("[data-sp-close]", root);
    closeBtn && closeBtn.addEventListener("click", close);

    log.addEventListener("click", e => {
      const chip = e.target.closest(".chip[data-msg]");
      if (chip) { send(chip.dataset.msg); return; }
      const again = e.target.closest("[data-breathe-again]");
      if (again) { runBreathe(again.closest(".breathe-card")); return; }
      const a = e.target.closest("a[href]");
      if (a && panel && !a.target && !a.hasAttribute("data-buy") && !a.href.startsWith("mailto:")) close(true);
    });

    // Restore session
    const saved = loadState();
    if (saved) {
      log.innerHTML = saved.html;
      ctx = Object.assign(ctx, saved.ctx);
      log.querySelectorAll(".breathe-card").forEach(resetBreatheCard);
      if (inline) requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    } else if (inline) {
      greet();
    }
  }

  function dismissBubble() {
    if (!bubble) return;
    bubble.classList.remove("show");
    try { sessionStorage.setItem("sparkle-bubble", "1"); } catch (_) {}
  }

  function open(question) {
    if (isAsk) {
      if (!coarse) input.focus();
      if (question) send(question);
      return;
    }
    opened = true;
    dismissBubble();
    panel.classList.add("open");
    launcher.classList.add("hidden");
    if (window.innerWidth <= 600) document.body.classList.add("chat-open-mobile");
    if (!log.children.length) greet(question);
    else if (question) send(question);
    else requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
    if (!coarse) setTimeout(() => input.focus({ preventScroll: true }), 250);
  }

  function close(silent) {
    if (!panel) return;
    panel.classList.remove("open");
    launcher.classList.remove("hidden");
    document.body.classList.remove("chat-open-mobile");
    if (!silent) launcher.focus({ preventScroll: true });
  }

  async function greet(thenAsk) {
    await botSay(KB.welcome);
    save();
    if (thenAsk) send(thenAsk);
  }

  function reset() {
    breatheToken++;
    ctx = { turns: 0, bookShownAt: -99, offer: null, storiesTold: [], resShown: [], fallbackN: 0, history: [] };
    log.innerHTML = "";
    try { sessionStorage.removeItem(STORE); } catch (_) {}
    greet();
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  function submit() {
    const v = input.value.trim();
    if (!v || busy) return;
    input.value = "";
    autosize();
    send(v);
  }

  async function send(text) {
    if (busy) return;
    busy = true;
    sendBtn.disabled = true;
    log.querySelectorAll(".chips").forEach(c => c.remove());

    const m = document.createElement("div");
    m.className = "msg user";
    m.innerHTML = `<div class="bubble">${esc(text)}</div>`;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    ctx.history.push({ role: "user", content: text });

    let reply;
    if (CFG.ai && CFG.ai.endpoint) {
      try { reply = await remoteRespond(text); } catch (_) { reply = respond(text); }
    } else {
      reply = respond(text);
    }
    await botSay(reply);
    ctx.history.push({ role: "assistant", content: (reply.text || []).join(" ").replace(/<[^>]+>/g, "") });
    if (ctx.history.length > 24) ctx.history = ctx.history.slice(-24);
    save();
    busy = false;
    sendBtn.disabled = false;
  }

  /* ---------------- Rendering ---------------- */
  function scrollTo(msg) {
    const bottom = log.scrollHeight - log.clientHeight;
    const target = msg ? Math.min(bottom, msg.offsetTop - 10) : bottom;
    if (target > log.scrollTop) log.scrollTop = target;
  }

  async function botSay(r) {
    // typing indicator
    const typing = document.createElement("div");
    typing.className = "msg bot";
    typing.innerHTML = `<img class="m-av" src="${AV}" alt="" width="32" height="32"><div class="typing" aria-label="Sparkle is typing"><i></i><i></i><i></i></div>`;
    log.appendChild(typing);
    scrollTo();
    await wait(550 + Math.random() * 450);
    typing.remove();

    const msg = document.createElement("div");
    msg.className = "msg bot";
    msg.innerHTML = `<img class="m-av" src="${AV}" alt="" width="32" height="32"><div class="m-body"></div>`;
    log.appendChild(msg);
    const body = $(".m-body", msg);

    // Main bubble
    if ((r.text && r.text.length) || r.bullets || r.quote || r.after || r.offerLine) {
      const b = document.createElement("div");
      b.className = "bubble";
      body.appendChild(b);
      for (const p of r.text || []) { await streamPara(b, p, msg); }
      if (r.bullets) {
        const ul = document.createElement("ul");
        b.appendChild(ul);
        for (const li of r.bullets) {
          const el = document.createElement("li");
          el.innerHTML = li;
          el.style.animation = "msg-in .35s ease";
          ul.appendChild(el);
          scrollTo(msg);
          await wait(140);
        }
      }
      if (r.quote) {
        const q = document.createElement("div");
        q.className = "b-quote";
        q.innerHTML = `${r.quote[0]}<cite>${r.quote[1]}</cite>`;
        b.appendChild(q);
        scrollTo(msg);
        await wait(200);
      }
      for (const p of r.after || []) { await streamPara(b, p, msg); }
      if (r.offerLine) { await streamPara(b, `<strong>${r.offerLine}</strong>`, msg); }
    }

    // Story
    const st = r.story ? KB.stories[r.story] : r.storyCard;
    if (st) {
      await wait(250);
      const card = document.createElement("div");
      card.className = "story-card";
      card.style.animation = "msg-in .4s ease";
      card.innerHTML = `<div class="s-tag">📖 From the book · ${st.chapter}</div><h5>${st.title}</h5>` + st.paras.map(p => `<p>${p}</p>`).join("");
      body.appendChild(card);
      scrollTo(msg);
    }

    // Cards
    for (const c of r.cards || []) {
      await wait(260);
      const el = renderCard(c);
      if (!el) continue;
      el.style.animation = "msg-in .4s ease";
      body.appendChild(el);
      scrollTo(msg);
      if (c.type === "breathe") runBreathe(el);
    }

    // Chips
    if (r.chips && r.chips.length) {
      await wait(120);
      const chips = document.createElement("div");
      chips.className = "chips";
      chips.innerHTML = r.chips.slice(0, 6).map(c => {
        const label = typeof c === "string" ? c : c.label;
        const gold = typeof c === "object" && c.gold;
        return `<button type="button" class="chip${gold ? " gold" : ""}" data-msg="${esc(label)}">${esc(label)}</button>`;
      }).join("");
      log.appendChild(chips);
      scrollTo(msg);
    }
  }

  function streamPara(container, html, msg) {
    const p = document.createElement("p");
    p.innerHTML = html;
    container.appendChild(p);
    if (reduce) { scrollTo(msg); return Promise.resolve(); }
    const words = [];
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = part;
        frag.appendChild(s);
        words.push(s);
      });
      n.parentNode.replaceChild(frag, n);
    });
    return new Promise(res => {
      let i = 0;
      (function step() {
        const end = Math.min(words.length, i + 2);
        for (; i < end; i++) words[i].classList.add("on");
        scrollTo(msg);
        if (i < words.length) setTimeout(step, 30);
        else { p.innerHTML = html; res(); }
      })();
    });
  }

  function bookCover() { return "assets/img/book-cover-600.webp"; }

  function renderCard(c) {
    const div = document.createElement("div");
    const book = CFG.book || {};
    const live = !!book.amazonUrl;
    switch (c.type) {
      case "book":
        ctx.bookShownAt = ctx.turns;
        div.className = "book-card";
        div.innerHTML = `
          <img src="${bookCover()}" alt="When the Blueprint Burned book cover" width="74" height="111">
          <div>
            <span class="bc-kicker">${live ? "Available on Amazon" : "The book · coming soon to Amazon"}</span>
            <b>When the Blueprint Burned</b>
            <p>${c.note || "A Unicorn Mama memoir of neurodiversity, strength, joy &amp; humor, with 17 chapters of real life and the full survival toolkit."}</p>
            <div class="bc-actions">
              ${live
                ? `<a class="btn btn-gold" href="${esc(book.amazonUrl)}" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="#i-bag"/></svg> Buy on Amazon</a>`
                : `<a class="btn btn-gold" href="book.html#get-the-book" data-buy><svg class="icon" aria-hidden="true"><use href="#i-bell"/></svg> Notify me at launch</a>`}
              <a class="btn btn-ghost" href="book.html" style="--btn-fg:#fff;--btn-bd:rgba(255,255,255,.35)">Look inside</a>
            </div>
          </div>`;
        return div;
      case "res": {
        const res = KB.resources[c.id];
        if (!res) return null;
        if (!ctx.resShown.includes(c.id)) ctx.resShown.push(c.id);
        div.className = "link-cards";
        div.innerHTML = `${c.label ? `<small class="muted" style="font-size:.78rem;font-weight:700;letter-spacing:.04em;padding-left:2px">${c.label}</small>` : ""}
          <a class="res-card" href="${res.href}" download target="_blank" rel="noopener">
            <span class="ri"><svg class="icon" aria-hidden="true"><use href="#i-gift"/></svg></span>
            <span><b>${esc(res.title)}</b><small>${esc(res.desc)}</small></span>
            <svg class="icon" aria-hidden="true" style="margin-left:auto;color:var(--gold-600)"><use href="#i-download"/></svg>
          </a>`;
        return div;
      }
      case "links":
        div.className = "link-cards";
        div.innerHTML = c.items.map(([label, href, icon]) => {
          const ext = /^https?:/.test(href);
          const dl = /\.pdf$/i.test(href);
          return `<a class="link-card" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}${dl ? " download" : ""}><svg class="icon" aria-hidden="true"><use href="${icon || "#i-arrow"}"/></svg>${esc(label)}<svg class="icon" aria-hidden="true"><use href="#i-${ext ? "external" : dl ? "download" : "arrow"}"/></svg></a>`;
        }).join("");
        return div;
      case "crisis":
        div.className = "crisis-card";
        div.innerHTML = `<b>If you or someone else is in immediate danger, call <a href="tel:911">911</a>.</b><br>In the U.S., you can call or text <a href="tel:988">988</a> to reach the Suicide &amp; Crisis Lifeline, free and confidential, 24/7. Outside the U.S., please contact your local emergency number.`;
        return div;
      case "breathe":
        div.className = "breathe-card";
        div.innerHTML = `<div class="breathe-orb"><span>·</span></div><div class="breathe-label">Get comfy…</div><div class="breathe-sub">4 rounds · about a minute</div>`;
        return div;
    }
    return null;
  }

  /* ---------------- Breathing exercise ---------------- */
  let breatheToken = 0;
  function resetBreatheCard(card) {
    const orb = $(".breathe-orb", card);
    orb.className = "breathe-orb";
    $("span", orb).textContent = "·";
    $(".breathe-label", card).textContent = "Ready when you are.";
    $(".breathe-sub", card).innerHTML = `<button type="button" class="chip gold" data-breathe-again style="margin-top:8px">Start breathing</button>`;
  }
  async function runBreathe(card) {
    const token = ++breatheToken;
    const orb = $(".breathe-orb", card), num = $("span", orb), label = $(".breathe-label", card), sub = $(".breathe-sub", card);
    const phases = [["Breathe in…", "in"], ["Hold…", "hold-full"], ["Breathe out…", "out"], ["Hold…", "hold-empty"]];
    label.textContent = "Get comfy…"; sub.textContent = "4 rounds · about a minute";
    await wait(1200);
    for (let round = 1; round <= 4; round++) {
      for (const [text, cls] of phases) {
        if (token !== breatheToken || !card.isConnected) return;
        orb.className = "breathe-orb " + cls;
        label.textContent = text;
        sub.textContent = `Round ${round} of 4`;
        for (let s = 4; s >= 1; s--) {
          if (token !== breatheToken || !card.isConnected) return;
          num.textContent = s;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
    orb.className = "breathe-orb";
    num.textContent = "💛";
    label.textContent = "Beautiful. Notice your shoulders. Did they drop a little?";
    sub.innerHTML = `<button type="button" class="chip" data-breathe-again style="margin-top:8px">Breathe again</button>`;
    save();
  }

  /* ---------------- Persistence ---------------- */
  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ html: log.innerHTML, ctx })); } catch (_) {}
  }
  function loadState() {
    try { const raw = sessionStorage.getItem(STORE); return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
  }

  /* ---------------- Page hooks ---------------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open-sparkle], [data-ask]");
    if (!t) return;
    e.preventDefault();
    if (document.getElementById("mobile-menu")) document.getElementById("mobile-menu").classList.remove("open"), document.body.classList.remove("menu-open");
    open(t.dataset.ask);
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && panel && panel.classList.contains("open") && !document.querySelector(".modal.open")) close();
  });
  window.addEventListener("resize", () => {
    if (panel && panel.classList.contains("open")) document.body.classList.toggle("chat-open-mobile", window.innerWidth <= 600);
  });

  // _route: lets you test which topic a question maps to, e.g. Sparkle._route("help with IEP")
  window.Sparkle = { open, reset, _route: q => { const saved = JSON.stringify(ctx); const r = respond(q); ctx = JSON.parse(saved); return r._id; } };
  mount();
})();
