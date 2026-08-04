(function () {
  document.documentElement.classList.add('js-on');

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

  // ---- revelação ao entrar em vista + seção ativa no trilho ----
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.5 });

    sections.forEach(function (s) { activeObserver.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- convite de rolagem na capa ----
  var cue = document.querySelector('.scroll-cue');
  if (cue) {
    cue.addEventListener('click', function () {
      var target = document.querySelector(cue.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
