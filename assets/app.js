/* =====================================================================
   노블아이경희한의원 입원실 - 화면 구성 스크립트
   내용은 content.js 에서 읽어옵니다. 이 파일은 보통 손댈 일이 없습니다.
   ===================================================================== */
(function () {
  var S = window.SITE || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  var setText = function (id, v) { var el = $(id); if (el) el.textContent = v || ""; };
  var setHtml = function (id, v) { var el = $(id); if (el) el.innerHTML = v || ""; };
  var telHref = function (p) { return "tel:" + String(p || "").replace(/[^0-9+]/g, ""); };

  var ICONS = {
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v5H3z"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/><path d="M5 13h14"/></svg>',
    family: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><path d="M16 14h1a4 4 0 0 1 4 4v2"/></svg>',
    spine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M8 6h8M8 10h8M8 14h8M8 18h8"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14z"/><path d="M5 19l7-7"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18M12 4v16"/></svg>'
  };

  /* ---------- 기본 정보 ---------- */
  var brand = S.brand || {}, c = S.contact || {};
  document.title = brand.name + " " + brand.unit + " | " + (brand.tagline || "");
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && brand.description) metaDesc.setAttribute("content", brand.description);

  setHtml("logo", esc(brand.name) + "<small>" + esc(brand.unit) + "</small>");

  ["headerPhone", "heroPhone", "insPhone", "ctaPhone", "stickyPhone"].forEach(function (id) {
    var el = $(id); if (!el) return;
    el.href = telHref(c.phone);
    if (id === "stickyPhone") el.innerHTML = "<span>전화 상담</span>";
    else el.textContent = (id === "headerPhone" ? "" : "전화 ") + c.phone;
  });
  ["headerKakao", "heroKakao", "insKakao", "ctaKakao", "stickyKakao"].forEach(function (id) { var el = $(id); if (el) el.href = c.kakao || "#"; });
  ["heroBooking", "ctaBooking", "stickyBooking"].forEach(function (id) {
    var el = $(id); if (!el) return;
    if (c.naverBooking) el.href = c.naverBooking; else el.hidden = true;
  });

  /* ---------- 첫 화면 ---------- */
  var h = S.hero || {};
  if ($("heroImg")) $("heroImg").src = h.image || "";
  setText("heroEyebrow", h.eyebrow);
  setText("heroTitle", h.title);
  setText("heroSub", h.subtitle);
  setHtml("heroBadges", (h.badges || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join(""));

  /* ---------- 핵심 숫자 ---------- */
  setHtml("stats", (S.stats || []).map(function (s) {
    return '<div class="stat"><b>' + esc(s.value) + "</b><span>" + esc(s.label) + "</span><small>" + esc(s.desc) + "</small></div>";
  }).join(""));

  /* ---------- 이런 분께 ---------- */
  var a = S.audiences || {};
  setText("whoEyebrow", a.eyebrow); setText("whoTitle", a.title);
  setHtml("whoItems", (a.items || []).map(function (it) {
    return '<div class="card"><div class="icon">' + (ICONS[it.icon] || ICONS.leaf) + "</div><h3>" + esc(it.title) + "</h3><p>" + esc(it.desc) + "</p></div>";
  }).join(""));

  /* ---------- 병실 ---------- */
  var r = S.rooms || {};
  setText("roomsEyebrow", r.eyebrow); setText("roomsTitle", r.title); setText("roomsLead", r.lead);
  setHtml("roomsItems", (r.items || []).map(function (it) {
    return '<article class="room">' +
      (it.highlight ? '<span class="tag-family">가족 동반 가능</span>' : "") +
      '<img src="' + esc(it.image) + '" alt="' + esc(it.name) + '" loading="lazy">' +
      '<div class="room-body"><span class="en">' + esc(it.en) + "</span><h3>" + esc(it.name) + "</h3>" +
      '<p class="summary">' + esc(it.summary) + "</p>" +
      '<ul class="features">' + (it.features || []).map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></div></article>";
  }).join(""));
  setHtml("roomsFacilities", (r.facilities || []).map(function (f) {
    return '<div class="facility"><h4>' + esc(f.title) + "</h4><p>" + esc(f.desc) + "</p></div>";
  }).join(""));

  /* ---------- 자동차보험 ---------- */
  var ins = (S.insurance || {}).auto || {};
  setText("insEyebrow", ins.eyebrow); setText("insTitle", ins.title); setText("insLead", ins.lead);
  setHtml("insPoints", (ins.points || []).map(function (p, i) {
    return '<li><span class="num">' + (i + 1) + "</span><div><h4>" + esc(p.title) + "</h4><p>" + esc(p.desc) + "</p></div></li>";
  }).join(""));
  setText("insNote", ins.note);
  setText("insPrepTitle", ins.prepTitle);
  setHtml("insPrep", (ins.prep || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join(""));

  /* ---------- 건강보험 (켜져 있을 때만) ---------- */
  var he = (S.insurance || {}).health || {};
  if (he.enabled && $("health")) {
    $("health").hidden = false;
    setText("healthEyebrow", he.eyebrow); setText("healthTitle", he.title); setText("healthLead", he.lead);
    setHtml("healthPoints", (he.points || []).map(function (p) {
      return '<div class="card"><h3>' + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p></div>";
    }).join(""));
    setText("healthNote", he.note);
    var navEl = $("nav");
    if (navEl) { var link = document.createElement("a"); link.href = "#health"; link.textContent = "건강보험"; navEl.insertBefore(link, navEl.children[2] || null); }
  }

  /* ---------- 치료 ---------- */
  var t = S.treatments || {};
  setText("trEyebrow", t.eyebrow); setText("trTitle", t.title); setText("trLead", t.lead);
  setHtml("trItems", (t.items || []).map(function (it) {
    return '<div class="card"><h3>' + esc(it.title) + "</h3><p>" + esc(it.desc) + "</p></div>";
  }).join(""));
  if (t.extra) setHtml("trExtra", '<div class="icon">' + ICONS.scan + "</div><div><h4>" + esc(t.extra.title) + "</h4><p>" + esc(t.extra.desc) + "</p></div>");
  else if ($("trExtra")) $("trExtra").hidden = true;

  /* ---------- 절차 ---------- */
  var pr = S.process || {};
  setText("prEyebrow", pr.eyebrow); setText("prTitle", pr.title);
  setHtml("prSteps", (pr.steps || []).map(function (s) { return "<li><h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p></li>"; }).join(""));
  setHtml("prNotes", (pr.notes || []).map(function (n) { return "<p>" + esc(n) + "</p>"; }).join(""));

  /* ---------- 사진 ---------- */
  var g = S.gallery || {}, gItems = g.items || [];
  setText("gaEyebrow", g.eyebrow); setText("gaTitle", g.title);

  /* 병실 영상: 소리 없이 자동 반복 재생, 화면에 보일 때만 재생 */
  var gv = g.video, tour = $("gaVideo");
  if (gv && gv.src && tour) {
    tour.innerHTML =
      '<div class="tour-media"><video id="tourVideo" muted loop playsinline controls preload="metadata"' +
      (gv.poster ? ' poster="' + esc(gv.poster) + '"' : "") + ' aria-label="' + esc(gv.title || "입원실 영상") + '">' +
      '<source src="' + esc(gv.src) + '" type="video/mp4"></video></div>' +
      '<div class="tour-text">' + (gv.label ? '<span class="en">' + esc(gv.label) + "</span>" : "") +
      "<h3>" + esc(gv.title) + "</h3><p>" + esc(gv.desc) + "</p>" +
      '<ul class="features">' + (gv.points || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
    tour.hidden = false;
    var vid = $("tourVideo");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (vid && !reduce && "IntersectionObserver" in window) {
      var userPaused = false;
      vid.addEventListener("pause", function () { if (vid.dataset.auto !== "1") userPaused = true; vid.dataset.auto = ""; });
      vid.addEventListener("play", function () { userPaused = false; });
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !userPaused) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
          else if (!e.isIntersecting && !vid.paused) { vid.dataset.auto = "1"; vid.pause(); }
        });
      }, { threshold: 0.4 }).observe(vid);
    }
  }

  setHtml("gaItems", gItems.map(function (it, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + esc(it.caption) + ' 크게 보기"><img src="' + esc(it.src) + '" alt="' + esc(it.caption) + '" loading="lazy"><figcaption>' + esc(it.caption) + "</figcaption></button>";
  }).join(""));

  /* ---------- 의료진 ---------- */
  var d = S.doctor || {};
  setText("docEyebrow", d.eyebrow);
  setHtml("docName", esc(d.name) + "<small>" + esc(d.title) + "</small>");
  if ($("docImg")) { $("docImg").src = d.image || ""; $("docImg").alt = (d.name || "") + " " + (d.title || ""); }
  setText("docQuote", d.quote); setText("docDesc", d.desc);
  setHtml("docCareer", (d.career || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""));
  setHtml("docTags", (d.tags || []).map(function (x) { return "<li>#" + esc(x) + "</li>"; }).join(""));

  /* ---------- FAQ ---------- */
  var f = S.faq || {};
  setText("faqEyebrow", f.eyebrow); setText("faqTitle", f.title);
  setHtml("faqItems", (f.items || []).map(function (it) {
    return '<div class="faq-item"><button type="button" aria-expanded="false">' + esc(it.q) + '</button><div class="faq-answer">' + esc(it.a) + "</div></div>";
  }).join(""));
  Array.prototype.forEach.call(document.querySelectorAll(".faq-item button"), function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentNode, open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- 오시는 길 / 진료시간 ---------- */
  var l = S.location || {}, ml = l.mapLinks || {};
  setText("locEyebrow", l.eyebrow); setText("locTitle", l.title);
  setText("locAddress", l.address); setText("locLandmark", l.landmark);
  var links = [];
  if (ml.naver) links.push('<a href="' + esc(ml.naver) + '" target="_blank" rel="noopener">네이버지도</a>');
  if (ml.kakao) links.push('<a href="' + esc(ml.kakao) + '" target="_blank" rel="noopener">카카오맵</a>');
  if (ml.google) links.push('<a href="' + esc(ml.google) + '" target="_blank" rel="noopener">구글지도</a>');
  if (c.naverPlaceInpatient) links.push('<a href="' + esc(c.naverPlaceInpatient) + '" target="_blank" rel="noopener">입원실 플레이스</a>');
  setHtml("locMapLinks", links.join(""));
  setHtml("hoursTable", ((S.hours || {}).rows || []).map(function (row) {
    return "<tr><td>" + esc(row.day) + "</td><td>" + esc(row.time) + "</td><td>" + esc(row.note) + "</td></tr>";
  }).join(""));
  setText("hoursNotice", (S.hours || {}).notice);
  setHtml("locParking", (l.parking || []).map(function (p) { return "<li><b>" + esc(p.title) + "</b><span>" + esc(p.desc) + "</span></li>"; }).join(""));
  setHtml("locTransit", (l.transit || []).map(function (p) { return "<li><b>" + esc(p.title) + "</b><span>" + esc(p.desc) + "</span></li>"; }).join(""));
  setText("locAreas", l.areas);

  /* ---------- 푸터 ---------- */
  var ft = S.footer || {};
  setText("footBrand", (ft.legalName || brand.name) + " " + (brand.unit || ""));
  setText("footAddress", l.address);
  var meta = [];
  if (ft.representative) meta.push("대표 " + ft.representative);
  if (ft.businessNumber) meta.push("사업자등록번호 " + ft.businessNumber);
  if (c.phone) meta.push("전화 " + c.phone);
  setText("footMeta", meta.join(" · "));
  var fl = [];
  if (brand.domain) fl.push('<a href="' + esc(brand.domain) + '" target="_blank" rel="noopener">본원 홈페이지</a>');
  if (c.naverPlaceMain) fl.push('<a href="' + esc(c.naverPlaceMain) + '" target="_blank" rel="noopener">네이버 플레이스(진료실)</a>');
  if (c.naverPlaceInpatient) fl.push('<a href="' + esc(c.naverPlaceInpatient) + '" target="_blank" rel="noopener">네이버 플레이스(입원실)</a>');
  if (c.blog) fl.push('<a href="' + esc(c.blog) + '" target="_blank" rel="noopener">블로그</a>');
  if (c.youtube) fl.push('<a href="' + esc(c.youtube) + '" target="_blank" rel="noopener">유튜브</a>');
  if (c.cafe) fl.push('<a href="' + esc(c.cafe) + '" target="_blank" rel="noopener">카페</a>');
  setHtml("footLinks", fl.join(""));
  setText("footDisclaimer", ft.disclaimer);
  setText("footCopy", ft.copyright);

  /* ---------- 구조화 데이터 (검색엔진용) ---------- */
  try {
    var ld = {
      "@context": "https://schema.org", "@type": "MedicalClinic",
      "name": brand.name + " " + brand.unit, "description": brand.description, "telephone": c.phone,
      "url": location.href.split("#")[0], "image": h.image,
      "address": { "@type": "PostalAddress", "streetAddress": l.address, "addressLocality": "화성시", "addressRegion": "경기도", "addressCountry": "KR" },
      "geo": { "@type": "GeoCoordinates", "latitude": l.lat, "longitude": l.lng },
      "parentOrganization": { "@type": "MedicalClinic", "name": brand.name, "url": brand.domain },
      "sameAs": [c.naverPlaceInpatient, c.naverPlaceMain, c.blog, c.youtube].filter(Boolean)
    };
    var sc = document.createElement("script"); sc.type = "application/ld+json"; sc.text = JSON.stringify(ld); document.head.appendChild(sc);
  } catch (e) {}

  /* ---------- 모바일 메뉴 ---------- */
  var toggle = $("menuToggle"), nav = $("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
  }

  /* ---------- 사진 크게 보기 ---------- */
  var lb = $("lightbox"), lbImg = $("lbImg"), lbCap = $("lbCaption"), cur = 0;
  function showLb(i) {
    if (!gItems.length) return;
    cur = (i + gItems.length) % gItems.length;
    lbImg.src = gItems[cur].src; lbImg.alt = gItems[cur].caption || ""; lbCap.textContent = gItems[cur].caption || "";
    lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function hideLb() { lb.hidden = true; document.body.style.overflow = ""; }
  if (lb) {
    $("gaItems").addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b) showLb(parseInt(b.getAttribute("data-i"), 10)); });
    $("lbClose").addEventListener("click", hideLb);
    $("lbPrev").addEventListener("click", function () { showLb(cur - 1); });
    $("lbNext").addEventListener("click", function () { showLb(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) hideLb(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") hideLb(); else if (e.key === "ArrowLeft") showLb(cur - 1); else if (e.key === "ArrowRight") showLb(cur + 1);
    });
    var sx = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showLb(dx < 0 ? cur + 1 : cur - 1); });
  }
})();
