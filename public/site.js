(() => {
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

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate3d(0,0,0)';
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[class*="animation-up"]').forEach((element) => reveal.observe(element));
})();
