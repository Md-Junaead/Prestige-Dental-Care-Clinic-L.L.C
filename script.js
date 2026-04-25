/* ============================================================
   PRESTIGE DENTAL CARE CLINIC – SCRIPT
   Features: Loader, Sticky Nav, Scroll Reveal, Testimonial Slider,
             Back to Top, Form Interaction, Hamburger Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero reveal after loader
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 1200);
  });


  // ===== STICKY NAVBAR =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe all reveal elements except hero (handled by loader)
  document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => {
    revealObserver.observe(el);
  });


  // ===== SMOOTH SCROLL for NAV links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ===== TESTIMONIAL SLIDER =====
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  let current = 0;
  let slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const count = Math.ceil(cards.length / slidesPerView);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    if (!track) return;
    const maxIndex = Math.ceil(cards.length / slidesPerView) - 1;
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0;
    track.style.transform = `translateX(-${current * cardWidth * slidesPerView}px)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoplay = setInterval(() => goTo(current + 1 > Math.ceil(cards.length / slidesPerView) - 1 ? 0 : current + 1), 5000);
  track?.parentElement?.addEventListener('mouseenter', () => clearInterval(autoplay));
  track?.parentElement?.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1 > Math.ceil(cards.length / slidesPerView) - 1 ? 0 : current + 1), 5000);
  });

  // Touch / swipe support
  let startX = 0;
  track?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track?.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  buildDots();
  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    current = 0;
    buildDots();
    goTo(0);
  });


  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ===== APPOINTMENT FORM SUBMIT =====
  const apptSubmit = document.getElementById('apptSubmit');
  apptSubmit?.addEventListener('click', () => {
    const name = document.getElementById('apptName')?.value?.trim();
    const phone = document.getElementById('apptPhone')?.value?.trim();
    if (!name || !phone) {
      apptSubmit.textContent = '⚠ Please fill in Name & Phone';
      apptSubmit.style.background = '#F87171';
      setTimeout(() => {
        apptSubmit.innerHTML = 'Confirm Appointment <span class="btn-arrow">→</span>';
        apptSubmit.style.background = '';
      }, 2500);
      return;
    }
    apptSubmit.innerHTML = '✓ Request Sent! We\'ll call you soon.';
    apptSubmit.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
    // Reset after 4s
    setTimeout(() => {
      ['apptName','apptPhone','apptService','apptMsg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      apptSubmit.innerHTML = 'Confirm Appointment <span class="btn-arrow">→</span>';
      apptSubmit.style.background = '';
    }, 4000);
  });


  // ===== ACTIVE NAV HIGHLIGHTING on scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        currentSection = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${currentSection}`) {
        a.style.color = 'var(--blue)';
      }
    });
  }, { passive: true });

});
