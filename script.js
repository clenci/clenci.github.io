(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.section[id]'));

  // ---- trilho de posição (desktop) + índice flutuante (mobile) ----
  var nav = document.getElementById('sectionNav');
  var mobileSheet = document.getElementById('mobileIndexSheet');
  var navLinks = [];

  sections.forEach(function (section) {
    var id = section.id;
    var label = section.getAttribute('data-label') || id;

    var a = document.createElement('a');
    a.href = '#' + id;
    a.setAttribute('aria-label', label);
    var span = document.createElement('span');
    span.className = 'label';
    span.textContent = label;
    a.appendChild(span);
    nav.appendChild(a);
    navLinks.push({ id: id, el: a });

    var m = document.createElement('a');
    m.href = '#' + id;
    m.textContent = label;
    mobileSheet.appendChild(m);
  });

  function setActive(id) {
    navLinks.forEach(function (l) {
      l.el.classList.toggle('active', l.id === id);
    });
  }

  // ---- botão de índice mobile ----
  var toggle = document.getElementById('mobileIndexToggle');
  toggle.addEventListener('click', function () {
    mobileSheet.classList.toggle('open');
  });
  mobileSheet.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') mobileSheet.classList.remove('open');
  });

  // ---- barra de progresso ----
  var rail = document.getElementById('progressRail');
  function updateProgress() {
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    var pct = scrollable > 0 ? (h.scrollTop || document.body.scrollTop) / scrollable * 100 : 0;
    rail.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ---- seção ativa no trilho (a revelação de entrada agora é CSS puro, ver style.css) ----
  if ('IntersectionObserver' in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.5 });

    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  // ---- convite de rolagem na capa ----
  var cue = document.querySelector('.scroll-cue');
  if (cue) {
    cue.addEventListener('click', function () {
      var target = document.querySelector(cue.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---- barra de cookies + popup de privacidade ----
  var COOKIE_KEY = 'cookieNoticeDismissed';
  var cookieBar = document.getElementById('cookieBar');
  var dialog = document.getElementById('privacyDialog');

  if (cookieBar && !localStorage.getItem(COOKIE_KEY)) {
    cookieBar.classList.add('visible');
  }

  function dismissCookieBar() {
    if (!cookieBar) return;
    cookieBar.classList.remove('visible');
    localStorage.setItem(COOKIE_KEY, '1');
  }

  var dismissBtn = document.getElementById('cookieDismissBtn');
  if (dismissBtn) dismissBtn.addEventListener('click', dismissCookieBar);

  function openPrivacyDialog() {
    if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
  }

  var policyLink = document.getElementById('cookiePolicyLink');
  if (policyLink) {
    policyLink.addEventListener('click', function () {
      openPrivacyDialog();
      dismissCookieBar();
    });
  }

  var privacyIconBtn = document.getElementById('privacyIconBtn');
  if (privacyIconBtn) privacyIconBtn.addEventListener('click', openPrivacyDialog);

  var closeBtn = document.getElementById('privacyDialogClose');
  if (closeBtn && dialog) closeBtn.addEventListener('click', function () { dialog.close(); });

  // ---- eventos de conversão (contato via LinkedIn / e-mail) ----
  var CONTACT_LOCATIONS = [
    { selector: '.hero-lockup a[href*="linkedin.com/in/cezarlenci"]', method: 'linkedin', location: 'hero' },
    { selector: '.hero-lockup a[href^="mailto:"]', method: 'email', location: 'hero' },
    { selector: '.cta-buttons a[href*="linkedin.com/in/cezarlenci"]', method: 'linkedin', location: 'cta_card' },
    { selector: '.cta-buttons a[href^="mailto:"]', method: 'email', location: 'cta_card' },
    { selector: '.site-footer > div:first-child a[href*="linkedin.com/in/cezarlenci"]', method: 'linkedin', location: 'footer' },
    { selector: '.site-footer > div:first-child a[href^="mailto:"]', method: 'email', location: 'footer' }
  ];
  if (typeof gtag === 'function') {
    CONTACT_LOCATIONS.forEach(function (entry) {
      var el = document.querySelector(entry.selector);
      if (!el) return;
      el.addEventListener('click', function () {
        gtag('event', 'contact_click', { method: entry.method, location: entry.location });
      });
    });
  }

  if (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  }
})();
