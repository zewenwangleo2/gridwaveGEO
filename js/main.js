(function(){
  // --- Language init ---
  var saved = null;
  try { saved = localStorage.getItem("gridwave-lang"); } catch(e){}
  var browserLang = (navigator.language || "en").slice(0,2);
  var initialLang = saved || (browserLang === "es" ? "es" : "en");
  applyLanguage(initialLang);

  document.querySelectorAll(".lang-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  // --- Header scroll shadow ---
  var header = document.getElementById("site-header");
  function onScroll(){
    if (window.scrollY > 12) header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
    else header.style.boxShadow = "none";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  var navToggle = document.getElementById("nav-toggle");
  navToggle.addEventListener("click", function(){
    var isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  document.querySelectorAll(".main-nav a").forEach(function(link){
    link.addEventListener("click", function(){
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in-view"); });
  }

  // --- Hero globe (dot-matrix particle sphere) ---
  var canvas = document.getElementById("hero-globe-canvas");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var size = 640;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var N = 900;
    var pts = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var rad = Math.sqrt(1 - y * y);
      var theta = golden * i;
      pts.push([Math.cos(theta) * rad, y, Math.sin(theta) * rad]);
    }

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var angle = 0.35;
    var R = size * 0.4;
    var cx = size / 2, cy = size / 2;

    function drawGlobe() {
      ctx.clearRect(0, 0, size, size);
      var cosA = Math.cos(angle), sinA = Math.sin(angle);
      var projected = new Array(pts.length);
      for (var j = 0; j < pts.length; j++) {
        var p = pts[j];
        var x = p[0] * cosA - p[2] * sinA;
        var z = p[0] * sinA + p[2] * cosA;
        projected[j] = [x, p[1], z];
      }
      projected.sort(function (a, b) { return a[2] - b[2]; });
      for (var k = 0; k < projected.length; k++) {
        var q = projected[k];
        var depth = (q[2] + 1.15) / 2.15;
        if (depth < 0.14) continue;
        var px = cx + q[0] * R;
        var py = cy - q[1] * R;
        var r = 0.6 + depth * 1.7;
        var alpha = 0.12 + depth * 0.78;
        ctx.beginPath();
        ctx.fillStyle = "rgba(199,214,236," + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(140,180,255,0.9)";
        ctx.shadowBlur = depth * 4;
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawGlobe();
    if (!reduceMotion) {
      (function tick() {
        angle += 0.0022;
        drawGlobe();
        requestAnimationFrame(tick);
      })();
    }
  }
})();
