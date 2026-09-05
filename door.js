(function () {
  const hall = document.getElementById("hall");
  const statusEl = document.getElementById("status");
  const invitePanel = document.getElementById("invite-panel");
  const waitEl = document.getElementById("invite-wait");
  const waitBar = document.getElementById("invite-wait-bar");
  const safariNote = document.getElementById("invite-safari");
  const homeInstall = document.getElementById("home-install");
  const feed = document.getElementById("feed");
  const holdFeed = document.getElementById("holdFeed");
  const contentPage = document.getElementById("content-page");
  const tagBoard = document.getElementById("tag-board");
  const shelfBack = document.getElementById("shelf-back");
  const bookCoverInput = document.getElementById("book-cover-input");
  const cabHud = document.getElementById("cab-hud");
  const faceImg = document.getElementById("face-img");
  const readerName = document.getElementById("reader-name");
  const coverInput = document.getElementById("cover-input");
  const backdropInput = document.getElementById("backdrop-input");
  const stageBg = document.getElementById("stage-bg");
  const homeHead = document.getElementById("home-head");
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.6 3.8l.6-1.3h3.6l.6 1.3 1.6.7 1.4-.5 2.5 2.5-.5 1.4.7 1.6 1.3.6v3.6l-1.3.6-.7 1.6.5 1.4-2.5 2.5-1.4-.5-1.6.7-.6 1.3h-3.6l-.6-1.3-1.6-.7-1.4.5-2.5-2.5.5-1.4-.7-1.6-1.3-.6v-3.6l1.3-.6.7-1.6-.5-1.4L6.6 4l1.4.5 1.6-.7z" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/><circle cx="12" cy="11.9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const CAMERA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8" width="17" height="11.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 8l1.4-2.4h5.2L16 8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.6" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
  const SCENE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.5 16.2l4.2-4.6 3 3.2 2.2-2.4 3.6 3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="9.2" r="1.3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20C10.5 18.4 7.3 15.8 5.4 11.9C4 9.1 5.2 6 8.4 6c1.8 0 3 1.1 3.6 2.2C12.6 7.1 13.8 6 15.6 6c3.2 0 4.4 3.1 3 5.9C16.7 15.8 13.5 18.4 12 20Z"/></svg>';
  const HEART_RAIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20C10.5 18.4 7.3 15.8 5.4 11.9C4 9.1 5.2 6 8.4 6c1.8 0 3 1.1 3.6 2.2C12.6 7.1 13.8 6 15.6 6c3.2 0 4.4 3.1 3 5.9C16.7 15.8 13.5 18.4 12 20Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  const LIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12M6 12h12M6 17h8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
  let key = "";
  let busy = false;
  let settingsWrap = null;
  let settingsCatch = null;
  let catalog = {};
  let hostTab = "stock";
  let openAccount = "";
  let ready = false;
  let booting = false;
  let bootTimer = 0;
  let holdTimer = 0;
  let holdFired = false;
  let selected = new Set();
  let selectMode = false;
  let withdrawTimer = 0;

  function setBoot(on, text) {
    if (!hall) return;
    hall.classList.toggle("is-booting", !!on);
    hall.classList.toggle("with-feed", true);
    if (statusEl && text != null) statusEl.textContent = text;
  }

  function setCabRun(on) {
    const cover = document.querySelector("#cab-hud .cab-cover");
    if (cover) cover.classList.toggle("is-run", !!on);
  }

  function layoutStage() {
    if (!stageBg || !hall || stageBg.hidden) return;
    const hallBox = hall.getBoundingClientRect();
    const tags = document.getElementById("tag-board");
    const startBox = tags && !tags.hidden ? tags.getBoundingClientRect() : (feed ? feed.getBoundingClientRect() : null);
    const endBox = (openAccount ? contentPage : feed);
    const box = endBox && !endBox.hidden ? endBox.getBoundingClientRect() : startBox;
    const start = startBox ? Math.max(0, startBox.top - hallBox.top) : 180;
    const end = box ? Math.max(start + 24, box.top - hallBox.top) : start + 80;
    const fade = "linear-gradient(to bottom, #000 0, #000 " + Math.round(start) + "px, transparent " + Math.round(end) + "px)";
    stageBg.style.height = Math.round(end) + "px";
    stageBg.style.webkitMaskImage = fade;
    stageBg.style.maskImage = fade;
  }

  function paintStage(reader) {
    if (!stageBg || !hall) return;
    if (reader && reader.has_backdrop && reader.id) {
      hall.classList.add("has-backdrop");
      stageBg.style.backgroundImage = "url(" + window.FamiGate.origin() + "/backdrop?person=" + encodeURIComponent(reader.id) + "&k=" + encodeURIComponent(key) + "&r=" + (reader.backdrop_rev || 0) + ")";
      stageBg.hidden = false;
      if (readerName) readerName.classList.add("is-on-dark");
      requestAnimationFrame(layoutStage);
    } else {
      hall.classList.remove("has-backdrop");
      if (readerName) readerName.classList.remove("is-on-light", "is-on-dark");
      stageBg.hidden = true;
      stageBg.style.backgroundImage = "";
    }
  }

  function insButton(className, svg, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ins-icon " + className;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.innerHTML = '<span class="ins-ring"></span><span class="ins-face">' + svg + "</span>";
    return btn;
  }

  function jobBadge(svg) {
    const badge = document.createElement("span");
    badge.className = "ins-icon job-icon";
    badge.setAttribute("aria-hidden", "true");
    badge.innerHTML = '<span class="ins-ring"></span><span class="ins-face">' + svg + "</span>";
    return badge;
  }

  function setJobRun(entry, on) {
    if (!entry) return;
    entry.classList.toggle("is-run", !!on);
    entry.disabled = !!on;
  }

  function showWaitCard(title) {
    const mask = document.getElementById("waitMask");
    const head = document.getElementById("waitTitle");
    const pct = document.getElementById("waitPct");
    if (head) head.textContent = title;
    if (pct) pct.textContent = "0%";
    if (mask) mask.hidden = false;
  }

  function hideWaitCard() {
    const mask = document.getElementById("waitMask");
    if (mask) mask.hidden = true;
  }

  function setWaitPct(n) {
    const pct = document.getElementById("waitPct");
    if (pct) pct.textContent = String(n) + "%";
  }

  function postFile(url, body, onPct) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr);
        else reject(new Error("fail"));
      };
      xhr.onerror = function () { reject(new Error("net")); };
      if (xhr.upload) {
        xhr.upload.onprogress = function (ev) {
          if (ev.lengthComputable && ev.total && onPct) onPct(Math.round((ev.loaded / ev.total) * 100));
        };
      }
      xhr.send(body);
    });
  }

  function closeSettings() {
    document.querySelectorAll(".settings-menu").forEach(function (menu) { menu.hidden = true; });
    if (settingsCatch) settingsCatch.hidden = true;
    document.querySelectorAll(".settings-toggle").forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.classList.remove("is-live");
    });
    document.documentElement.classList.remove("settings-open");
  }

  function ensureSettingsCatch() {
    if (settingsCatch && settingsCatch.isConnected) return settingsCatch;
    settingsCatch = document.createElement("div");
    settingsCatch.className = "settings-catch";
    settingsCatch.hidden = true;
    settingsCatch.addEventListener("click", closeSettings);
    document.body.appendChild(settingsCatch);
    return settingsCatch;
  }

  function placeSettingsMenu(toggle, menu) {
    const box = toggle.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.right = Math.max(12, window.innerWidth - box.right) + "px";
    menu.style.top = Math.round(box.bottom + 8) + "px";
  }

  function ensureSettings() {
    const host = document.querySelector("#cab-hud .cab-wrap");
    const existing = document.getElementById("album-settings");
    if (settingsWrap && settingsWrap.isConnected) return settingsWrap;
    settingsWrap = existing && existing.isConnected ? existing : document.createElement("div");
    const wrap = settingsWrap;
    wrap.id = "album-settings";
    wrap.className = "album-settings";
    wrap.hidden = true;
    wrap.innerHTML = "";
    const toggle = insButton("settings-toggle", GEAR, "設定");
    toggle.setAttribute("aria-expanded", "false");
    const menu = document.createElement("div");
    menu.className = "settings-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    function gearRow(svg, label, job, onClick) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "settings-entry";
      row.dataset.job = job;
      row.appendChild(jobBadge(svg));
      const text = document.createElement("span");
      text.textContent = label;
      row.appendChild(text);
      row.addEventListener("click", function () {
        closeSettings();
        onClick();
      });
      return row;
    }
    menu.appendChild(gearRow(CAMERA, "更換頭像", "cover", function () { if (coverInput) coverInput.click(); }));
    menu.appendChild(gearRow(SCENE, "更換背景", "backdrop", function () { if (backdropInput) backdropInput.click(); }));
    menu.appendChild(gearRow(LIST, "工作佇列", "queue", function () { openQueue(); }));
    toggle.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const open = menu.hidden;
      if (open) {
        const catcher = ensureSettingsCatch();
        catcher.hidden = false;
        document.body.appendChild(menu);
        menu.hidden = false;
        document.documentElement.classList.add("settings-open");
        requestAnimationFrame(function () { placeSettingsMenu(toggle, menu); });
      } else closeSettings();
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("is-live", open);
    });
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    if (host) host.appendChild(wrap);
    return wrap;
  }

  function showInvite() {
    if (!hall) return;
    hall.classList.add("is-invite");
    hall.classList.remove("is-booting");
    if (invitePanel) invitePanel.hidden = false;
    if (window.FamiGate.needsSafari() && safariNote) safariNote.hidden = false;
    if (window.MoneyGate) window.MoneyGate.open();
  }

  function hideInvite() {
    if (hall) hall.classList.remove("is-invite");
    if (invitePanel) invitePanel.hidden = true;
    const pad = document.getElementById("gate-pad");
    const dots = document.getElementById("gate-dots");
    if (pad) pad.hidden = true;
    if (dots) dots.hidden = true;
  }

  function renderMe(reader) {
    if (!reader || !cabHud) return;
    if (readerName) readerName.textContent = reader.display_name || "";
    if (faceImg) {
      faceImg.src = reader.has_cover
        ? window.FamiGate.origin() + "/cover?person=" + encodeURIComponent(reader.id) + "&k=" + encodeURIComponent(key) + "&r=" + (reader.cover_rev || 0)
        : "./face-default.jpg?v=1";
      faceImg.hidden = false;
    }
    cabHud.hidden = false;
    if (homeHead) homeHead.hidden = false;
    const settings = ensureSettings();
    settings.hidden = false;
    paintStage(reader);
  }

  function thumbUrl(item) {
    return window.FamiGate.origin() + "/thumb?id=" + encodeURIComponent(item.id) + "&title=" + encodeURIComponent(item.title || "") + "&k=" + encodeURIComponent(key) + "&r=" + (item.cover_rev || 0);
  }

  function paintRailHeart() {
    const rail = document.getElementById("photo-rail");
    const heart = rail && rail.querySelector(".rail-heart");
    if (!heart) return;
    const ids = Array.from(selected);
    const loved = ids.length > 0 && ids.every(function (id) {
      const item = catalog[id];
      return item && item.favorite;
    });
    heart.classList.toggle("is-on", loved);
  }

  function showRail(on) {
    const rail = document.getElementById("photo-rail");
    if (!rail) return;
    rail.hidden = !on;
    document.documentElement.classList.toggle("has-rail", !!on);
    if (on && !rail.dataset.ready) {
      rail.dataset.ready = "1";
      const cover = insButton("rail-cover", CAMERA, "換封面");
      cover.addEventListener("click", function () {
        if (!bookCoverInput || !selected.size) return;
        bookCoverInput.value = "";
        bookCoverInput.click();
      });
      const heart = insButton("rail-heart", HEART_RAIL, "愛心");
      heart.addEventListener("click", heartSelected);
      rail.appendChild(cover);
      rail.appendChild(heart);
    }
    if (on) paintRailHeart();
    else {
      const heart = rail.querySelector(".rail-heart");
      if (heart) heart.classList.remove("is-on");
    }
  }

  function paintPicks() {
    document.querySelectorAll(".feed .tile").forEach(function (el) {
      el.classList.toggle("is-pick", selected.has(el.dataset.id));
    });
    showRail(selectMode && selected.size > 0);
    document.documentElement.classList.toggle("is-select", selectMode);
  }

  function enterSelect(id) {
    selectMode = true;
    if (id) selected.add(id);
    paintPicks();
  }

  function togglePick(id) {
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    selectMode = selected.size > 0;
    paintPicks();
  }

  function clearSelect() {
    selected = new Set();
    selectMode = false;
    paintPicks();
  }

  async function heartSelected() {
    const ids = Array.from(selected);
    for (const id of ids) {
      const item = catalog[id];
      if (!item) continue;
      await window.FamiGate.api("/api/fav", key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, on: !item.favorite }),
        timeout: 15000,
      });
    }
    clearSelect();
    if (openAccount) openContent(openAccount);
    else loadShelf();
  }

  function tileEl(item) {
    catalog[item.id] = item;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    btn.dataset.id = item.id;
    if (item.has_cover) {
      const img = document.createElement("img");
      img.alt = item.title || "";
      img.decoding = "async";
      img.src = thumbUrl(item);
      img.addEventListener("load", function () { img.classList.add("is-on"); });
      img.addEventListener("error", function () { img.hidden = true; });
      if (img.complete && img.naturalWidth) img.classList.add("is-on");
      btn.appendChild(img);
    }
    const shield = document.createElement("span");
    shield.className = "tile-shield";
    btn.appendChild(shield);
    if (item.favorite) {
      const heart = document.createElement("span");
      heart.className = "tile-heart";
      heart.innerHTML = HEART;
      btn.appendChild(heart);
    }
    if (item.ep) {
      const ep = document.createElement("span");
      ep.className = "tile-ep";
      ep.textContent = item.ep;
      btn.appendChild(ep);
    }
    if (item.badge) {
      const badge = document.createElement("span");
      badge.className = "tile-pct";
      badge.textContent = item.badge;
      btn.appendChild(badge);
    }
    btn.addEventListener("pointerdown", function (ev) {
      if (ev.button && ev.button !== 0) return;
      holdTimer = window.setTimeout(function () {
        holdFired = true;
        if (selectMode && selected.has(item.id) && selected.size === 1) {
          clearSelect();
          return;
        }
        enterSelect(item.id);
      }, 480);
    });
    function cancelHold() {
      window.clearTimeout(holdTimer);
      holdTimer = 0;
    }
    btn.addEventListener("pointerup", cancelHold);
    btn.addEventListener("pointercancel", cancelHold);
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (holdFired) {
        holdFired = false;
        return;
      }
      if (selectMode) {
        togglePick(item.id);
        return;
      }
      openItem(item);
    });
    return btn;
  }

  function paintModes() {
    const bar = document.getElementById("mode-bar");
    if (!bar) return;
    bar.querySelectorAll(".mode-btn").forEach(function (el) {
      el.classList.toggle("is-on", el.dataset.mode === hostTab);
    });
  }

  function paintLayer() {
    const onContent = !!openAccount;
    if (hall) hall.classList.toggle("is-content", onContent);
    if (feed) feed.hidden = onContent;
    if (contentPage) contentPage.hidden = !onContent;
    if (shelfBack) shelfBack.hidden = !onContent;
    const bar = document.getElementById("mode-bar");
    if (bar) bar.hidden = onContent;
  }

  function pickTab(tab) {
    hostTab = tab || "stock";
    if (tab !== "content") closeContent();
    clearSelect();
    paintModes();
    paintLayer();
    loadShelf();
  }

  function ensureModes() {
    const bar = document.getElementById("mode-bar");
    if (!bar) return;
    bar.innerHTML = "";
    bar.hidden = !!openAccount;
    if (tagBoard) tagBoard.hidden = false;
    [["fav", "最愛"], ["stock", "股票"]].forEach(function (pair) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-btn";
      btn.dataset.mode = pair[0];
      btn.textContent = pair[1];
      btn.addEventListener("click", function () { pickTab(pair[0]); });
      bar.appendChild(btn);
    });
    paintModes();
  }

  function closeAct() {
    const mask = document.getElementById("actMask");
    if (mask) mask.hidden = true;
  }

  function bindMaskClose(maskId, closeFn) {
    const mask = document.getElementById(maskId);
    if (!mask) return;
    if (window.FamiGate && window.FamiGate.lockSheetPage) window.FamiGate.lockSheetPage(mask);
    let down = false;
    mask.addEventListener("pointerdown", function (ev) { down = ev.target === mask; });
    mask.addEventListener("pointerup", function (ev) {
      if (down && ev.target === mask) closeFn();
      down = false;
    });
  }

  function fillAct(title, nodes) {
    const mask = document.getElementById("actMask");
    const head = document.getElementById("actTitle");
    const body = document.getElementById("actBody");
    if (head) head.textContent = title;
    if (body) {
      body.innerHTML = "";
      nodes.forEach(function (n) { body.appendChild(n); });
    }
    if (mask) mask.hidden = false;
  }

  function line(text) {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }

  function tone(el, text) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("is-up", "is-down");
    if (/^[+]/.test(text) || /盈|賺/.test(text)) el.classList.add("is-up");
    if (/^[−-]/.test(text) || /^-\$/.test(text)) el.classList.add("is-down");
  }

  function newsWhen(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function remainText(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const years = Math.floor(total / (365.25 * 24 * 3600));
    let left = total - Math.floor(years * 365.25 * 24 * 3600);
    const days = Math.floor(left / 86400);
    left -= days * 86400;
    const hours = Math.floor(left / 3600);
    left -= hours * 3600;
    const mins = Math.floor(left / 60);
    const secs = left - mins * 60;
    return years + "年 " + days + "天 " + pad2(hours) + ":" + pad2(mins) + ":" + pad2(secs);
  }

  function stopWithdrawClock() {
    if (withdrawTimer) {
      window.clearInterval(withdrawTimer);
      withdrawTimer = 0;
    }
  }

  function startWithdrawClock(iso) {
    stopWithdrawClock();
    const el = document.getElementById("ovWithdraw");
    if (!el) return;
    const end = Date.parse(iso || "");
    function tick() {
      if (!end || Number.isNaN(end)) {
        el.textContent = "可提領";
        el.classList.remove("is-done");
        return;
      }
      const left = end - Date.now();
      if (left <= 0) {
        el.textContent = "恭喜你！計畫成功";
        el.classList.add("is-done");
        stopWithdrawClock();
        return;
      }
      el.classList.remove("is-done");
      el.textContent = "可提領  " + remainText(left);
    }
    tick();
    withdrawTimer = window.setInterval(tick, 1000);
  }

  function holdRow(item) {
    catalog[item.id] = item;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "news-row";
    const title = document.createElement("strong");
    title.textContent = item.label || item.title || item.id;
    const meta = document.createElement("span");
    const bits = [];
    if (item.label && item.title && item.title !== item.label) bits.push(item.title);
    if (item.ep) bits.push(item.ep);
    if (item.badge) bits.push(item.badge);
    meta.textContent = bits.join(" · ");
    if (item.badge && /^[+]/.test(item.badge)) meta.classList.add("is-up");
    if (item.badge && /^[−-]/.test(item.badge)) meta.classList.add("is-down");
    btn.appendChild(title);
    btn.appendChild(meta);
    btn.addEventListener("click", function () { openItem(item); });
    return btn;
  }

  function paintHolds(items) {
    if (!holdFeed) return;
    holdFeed.innerHTML = "";
    (items || []).forEach(function (item) {
      holdFeed.appendChild(holdRow(item));
    });
  }

  function paintNews(rows) {
    const host = document.getElementById("newsList");
    if (!host) return;
    host.innerHTML = "";
    if (!rows || !rows.length) {
      const empty = document.createElement("p");
      empty.className = "news-empty";
      empty.textContent = "現在沒抓到新消息";
      host.appendChild(empty);
      return;
    }
    rows.forEach(function (row) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "news-row";
      const title = document.createElement("strong");
      title.textContent = row.title || "";
      const meta = document.createElement("span");
      meta.textContent = [row.publisher, newsWhen(row.at)].filter(Boolean).join(" · ");
      btn.appendChild(title);
      btn.appendChild(meta);
      btn.addEventListener("click", function () {
        if (!row.link) return;
        window.open(row.link, "_blank", "noopener");
      });
      host.appendChild(btn);
    });
  }

  function openItem(item) {
    if (item.kind === "broker") {
      openContent(item.id);
      return;
    }
    const nodes = [line(item.title || item.id)];
    if (item.detail) nodes.push(line(item.detail));
    if (item.note) nodes.push(line(item.note));
    fillAct(item.title || "持股", nodes);
  }

  function closeContent() {
    openAccount = "";
    stopWithdrawClock();
    if (contentPage) contentPage.hidden = true;
    paintLayer();
    ensureModes();
  }

  async function openContent(id) {
    if (busy) return;
    busy = true;
    openAccount = id;
    clearSelect();
    paintLayer();
    ensureModes();
    setCabRun(true);
    if (contentPage) contentPage.hidden = false;
    try {
      const x = await window.FamiGate.api("/api/account?id=" + encodeURIComponent(id), key, { timeout: 25000 });
      if (!x || !x.res || !x.res.ok || !x.j) return;
      const ov = x.j.overview || {};
      const cp = x.j.compound || {};
      const total = document.getElementById("ovTotal");
      if (total) total.textContent = ov.total || "—";
      tone(document.getElementById("ovGain"), [ov.gain, ov.gainPercent].filter(Boolean).join("  "));
      tone(document.getElementById("ovDay"), [ov.day, ov.dayPercent].filter(Boolean).join("  "));
      const market = document.getElementById("ovMarket");
      if (market) market.textContent = ov.market || "—";
      const future = document.getElementById("cpTotal");
      if (future) future.textContent = cp.future || "—";
      const note = document.getElementById("cpNote");
      if (note) note.textContent = cp.note || "";
      startWithdrawClock(ov.withdrawAt);
      paintHolds(x.j.items || []);
      paintNews(x.j.news || []);
      layoutStage();
    } finally {
      busy = false;
      setCabRun(false);
    }
  }

  async function openQueue() {
    const entry = document.querySelector('.settings-entry[data-job="queue"]');
    setJobRun(entry, true);
    setCabRun(true);
    try {
      const x = await window.FamiGate.api("/api/shelf?tab=stock", key, { timeout: 20000 });
      const pack = (x && x.j) || {};
      const nodes = [];
      if (pack.summary) {
        nodes.push(line(pack.summary.headline || "帳戶"));
        if (pack.summary.gain) nodes.push(line(pack.summary.gain));
        if (pack.summary.day) nodes.push(line(pack.summary.day));
        if (pack.summary.market) nodes.push(line(pack.summary.market));
      }
      nodes.push(line("報價會自動更新。點嘉信理財進內容頁。"));
      fillAct("工作佇列", nodes);
    } finally {
      setJobRun(entry, false);
      setCabRun(false);
    }
  }

  async function loadShelf() {
    if (!feed || openAccount) return;
    const x = await window.FamiGate.api("/api/shelf?tab=" + encodeURIComponent(hostTab), key, { timeout: 20000 });
    if (!x || !x.res || !x.res.ok || !x.j) return;
    catalog = {};
    feed.className = "feed news-list";
    feed.innerHTML = "";
    (x.j.items || []).forEach(function (item) {
      feed.appendChild(holdRow(item));
    });
    clearSelect();
    layoutStage();
  }

  function refreshOrigin() {
    return fetch("./config.js?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        const m = /VAULT_ORIGIN\s*=\s*"(https?:\/\/[^"]+)"/.exec(text);
        if (m) window.VAULT_ORIGIN = m[1];
      })
      .catch(function () {});
  }

  function scheduleReconnect() {
    if (ready || bootTimer) return;
    bootTimer = window.setTimeout(function () {
      bootTimer = 0;
      refreshOrigin().then(boot);
    }, 12000);
  }

  function enterHome(reader, token) {
    key = token;
    window.MYMONEY_VIEW_KEY = token;
    hideInvite();
    const blobs = document.querySelector(".blobs");
    if (blobs) blobs.hidden = true;
    window.FamiGate.savePersonal(token);
    window.FamiGate.pinKey(token);
    renderMe(reader);
    ensureModes();
    setBoot(false, "");
    if (statusEl) statusEl.textContent = "";
    pickTab(hostTab);
    ready = true;
    if (typeof navigator.standalone === "boolean" && !navigator.standalone) {
      const seen = localStorage.getItem("mymoney.installed");
      if (!seen && homeInstall) homeInstall.hidden = false;
    }
  }

  function enterAfterGate(token) {
    if (!document.getElementById("home-head") || !feed) {
      location.replace("./index.html?k=" + encodeURIComponent(token) + "#k=" + encodeURIComponent(token));
      return;
    }
    key = token;
    setBoot(true, "正在連接帳戶…");
    window.FamiGate.api("/api/door", token, { timeout: 20000 }).then(function (x) {
      if (!x.res || !x.res.ok || !x.j || x.j.kind === "invite") {
        if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
        scheduleReconnect();
        return;
      }
      enterHome(x.j.reader, token);
    }).catch(function () {
      if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
      scheduleReconnect();
    });
  }

  async function boot() {
    if (booting || ready) return;
    if (window.MYMONEY_NEED_GATE) return;
    booting = true;
    window.FamiGate.blockWebChrome();
    window.FamiGate.bindKeyboard();
    setBoot(true, "正在連接帳戶…");
    key = window.MYMONEY_VIEW_KEY || window.FamiGate.currentKey();
    if (window.MYMONEY_FORCE_INVITE) key = window.MYMONEY_URL_KEY || "";
    try {
      if (!window.FamiGate.origin()) {
        if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
        scheduleReconnect();
        return;
      }
      await window.FamiGate.api("/api/public", "", { timeout: 8000 }).catch(function () { return null; });
      if (!key) {
        setBoot(false);
        showInvite();
        if (statusEl) statusEl.textContent = "請用邀請連結打開";
        return;
      }
      const x = await window.FamiGate.api("/api/door", key, { timeout: 20000 });
      if (!x.res || !x.res.ok || !x.j) {
        if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
        scheduleReconnect();
        return;
      }
      if (x.j.kind === "invite") {
        setBoot(false);
        showInvite();
        if (statusEl) statusEl.textContent = "";
        return;
      }
      enterHome(x.j.reader, key);
    } catch (e) {
      if (statusEl) statusEl.textContent = "維護中,請5分鐘後再試";
      scheduleReconnect();
    } finally {
      booting = false;
    }
  }

  const homeInstalled = document.getElementById("home-installed");
  if (homeInstalled) homeInstalled.addEventListener("click", function () {
    try { localStorage.setItem("mymoney.installed", "1"); } catch (e) {}
    if (homeInstall) homeInstall.hidden = true;
  });

  if (coverInput) coverInput.addEventListener("change", async function () {
    const file = coverInput.files && coverInput.files[0];
    if (!file) return;
    const entry = document.querySelector('.settings-entry[data-job="cover"]');
    setJobRun(entry, true);
    setCabRun(true);
    try {
      const fd = new FormData();
      fd.append("cover", file);
      await fetch(window.FamiGate.origin() + "/api/cover?k=" + encodeURIComponent(key), { method: "POST", body: fd });
      const door = await window.FamiGate.api("/api/door", key, { timeout: 15000 });
      if (door.j && door.j.reader) renderMe(door.j.reader);
    } finally {
      setJobRun(entry, false);
      setCabRun(false);
      coverInput.value = "";
    }
  });

  if (backdropInput) backdropInput.addEventListener("change", async function () {
    const file = backdropInput.files && backdropInput.files[0];
    if (!file) return;
    const entry = document.querySelector('.settings-entry[data-job="backdrop"]');
    setJobRun(entry, true);
    showWaitCard("更換背景中");
    try {
      const fd = new FormData();
      fd.append("backdrop", file);
      await postFile(window.FamiGate.origin() + "/api/backdrop?k=" + encodeURIComponent(key), fd, setWaitPct);
      const door = await window.FamiGate.api("/api/door", key, { timeout: 15000 });
      if (door.j && door.j.reader) renderMe(door.j.reader);
    } finally {
      setJobRun(entry, false);
      hideWaitCard();
      backdropInput.value = "";
    }
  });

  if (bookCoverInput) bookCoverInput.addEventListener("change", async function () {
    const file = bookCoverInput.files && bookCoverInput.files[0];
    if (!file || !selected.size) return;
    const btn = document.querySelector(".rail-cover");
    if (btn) btn.classList.add("is-run");
    showWaitCard("更換封面中");
    const ids = Array.from(selected);
    try {
      for (let i = 0; i < ids.length; i++) {
        const fd = new FormData();
        fd.append("cover", file, file.name || "cover.jpg");
        await postFile(
          window.FamiGate.origin() + "/api/holding-cover?id=" + encodeURIComponent(ids[i]) + "&k=" + encodeURIComponent(key),
          fd,
          setWaitPct
        );
      }
      setWaitPct(100);
    } finally {
      hideWaitCard();
      if (btn) btn.classList.remove("is-run");
      bookCoverInput.value = "";
      clearSelect();
      if (openAccount) openContent(openAccount);
      else loadShelf();
    }
  });

  const actClose = document.getElementById("actClose");
  if (actClose) actClose.addEventListener("click", closeAct);
  bindMaskClose("actMask", closeAct);
  if (shelfBack) shelfBack.addEventListener("click", function (ev) {
    ev.preventDefault();
    closeContent();
    loadShelf();
  });
  window.addEventListener("resize", layoutStage);
  window.MoneyDoor = {
    enterAfterGate: enterAfterGate,
    refreshOrigin: refreshOrigin,
    openGate: showInvite,
  };
  if (hall) boot();
})();
