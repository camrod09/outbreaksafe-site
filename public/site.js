(() => {
  const root = document.documentElement;
  const reduceMotion = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The HTML was exported after Webflow/GSAP had already applied many inline
  // styles.  Own the motion state here instead of relying on those snapshots.
  root.classList.add('motion-ready');

  const menuButton = document.querySelector('.button-menu');
  const menu = document.querySelector('.nav-content');

  if (menuButton && menu) {
    menuButton.setAttribute('role', 'button');
    menuButton.setAttribute('tabindex', '0');
    menuButton.setAttribute('aria-label', 'Toggle navigation');
    menuButton.setAttribute('aria-expanded', 'false');

    const toggleMenu = () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menu.style.display = open ? 'flex' : 'none';
      menu.style.opacity = open ? '1' : '0';
      menu.style.transform = open ? 'translate3d(0,0,0)' : 'translate3d(0,-100%,0)';
    };

    menuButton.addEventListener('click', toggleMenu);
    menuButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const revealTargets = [
    ...document.querySelectorAll('.animation-up-0-1'),
    ...document.querySelectorAll('.gsap_split_word'),
  ];
  document.querySelectorAll('.gsap_split_word').forEach((word, index) => {
    word.style.setProperty('--motion-index', String(index % 8));
  });

  const show = (element) => {
    element.classList.add('motion-visible');
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(show);
  } else {
    const reveal = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    revealTargets.forEach((element) => reveal.observe(element));
  }
})();
