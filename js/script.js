/* ===== HACKATHON WEBSITE — SCRIPT.JS ===== */

(function () {
  'use strict';

  // ——— CONFIG ———
  // Set your event date and time here. Replace the string below with your event's date and time.
  // Format: 'Month Day, Year Hour:Minutes:Seconds' (in your local timezone)
  // Examples:
  //   new Date('June 15, 2026 09:00:00')
  //   new Date('August 1, 2026 18:30:00')
  //   new Date('2026-06-15T09:00:00-04:00')  ← with timezone offset
  // 8:00 AM EDT (UTC−4). The explicit offset pins the target to EDT for every
  // visitor regardless of their local timezone.
  const EVENT_DATE = new Date('2026-06-24T08:00:00-04:00');

  // ——— DOM REFS ———
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // ——— COUNTDOWN TIMER ———
  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

    const now = new Date();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  }

  if (cdDays && cdHours && cdMinutes && cdSeconds) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ——— NAVBAR SCROLL ———
  let lastScroll = 0;
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
    lastScroll = scrollY;
  }, { passive: true });

  // ——— MOBILE NAV TOGGLE ———
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close nav on link click
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navToggle) navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ——— SMOOTH SCROLL ———
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ——— BACK TO TOP ———
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ——— FAQ ACCORDION ———
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ——— SCROLL REVEAL (IntersectionObserver) ———
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // Stagger siblings (capped so long groups don't drag)
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = Math.min(idx * 35, 175) + 'ms';

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: just show everything
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

})();

// ——— SPEAKER MODAL ———
(function () {
  const overlay = document.getElementById('speakerModal');
  const closeBtn = document.getElementById('speakerModalClose');
  const modalName = document.getElementById('modalSpeakerName');
  const modalRole = document.getElementById('modalSpeakerRole');
  const modalTalkTitle = document.getElementById('modalSpeakerTalkTitle');
  const modalBio = document.getElementById('modalSpeakerBio');
  const modalDesc = document.getElementById('modalSpeakerDesc');
  const modalPhoto = document.getElementById('modalSpeakerPhoto');

  if (!overlay) return;

  document.querySelectorAll('.speaker-event').forEach(function (card) {
    card.addEventListener('click', function () {
      const role = card.dataset.role || '';
      const bio = card.dataset.bio || '';

      modalName.textContent = card.dataset.speaker;
      modalTalkTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.description;
      modalPhoto.src = card.dataset.photo;
      modalPhoto.alt = card.dataset.speaker;

      modalRole.textContent = role;
      modalRole.style.display = role ? 'block' : 'none';

      modalBio.textContent = bio;
      modalBio.style.display = bio ? 'block' : 'none';

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();

// ——— JUDGE MODAL ———
(function () {
  const overlay = document.getElementById('judgeModal');
  const closeBtn = document.getElementById('judgeModalClose');
  const modalPhoto = document.getElementById('modalPhoto');
  const modalPlaceholder = document.getElementById('modalPlaceholder');
  const modalName = document.getElementById('modalJudgeName');
  const modalTitle = document.getElementById('modalJudgeTitle');
  const modalBio = document.getElementById('modalJudgeBio');

  function openModal(card) {
    const name = card.dataset.name;
    const title = card.dataset.title;
    const photo = card.dataset.photo;
    const bio = card.dataset.bio || '';

    modalName.textContent = name;
    modalTitle.innerHTML = title;
    modalBio.textContent = bio;
    modalBio.style.display = bio ? 'block' : 'none';

    if (photo) {
      modalPhoto.src = photo;
      modalPhoto.alt = name;
      modalPhoto.style.display = 'block';
      modalPlaceholder.style.display = 'none';
    } else {
      modalPhoto.style.display = 'none';
      modalPlaceholder.style.display = 'flex';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.judge-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
