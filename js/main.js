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

  // --- Contact form (submits to Web3Forms, delivers to contactus@gridwaveglobal.com) ---
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = document.getElementById("contact-status");
    var submitBtn = document.getElementById("contact-submit");

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var dict = getCurrentDict();

      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        statusEl.textContent = dict.contact.statusNotConfigured;
        statusEl.className = "contact-status is-error";
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = dict.contact.statusSending;
      statusEl.className = "contact-status";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = dict.contact.statusSuccess;
            statusEl.className = "contact-status is-success";
            contactForm.reset();
          } else {
            statusEl.textContent = dict.contact.statusError;
            statusEl.className = "contact-status is-error";
          }
        })
        .catch(function () {
          statusEl.textContent = dict.contact.statusError;
          statusEl.className = "contact-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
