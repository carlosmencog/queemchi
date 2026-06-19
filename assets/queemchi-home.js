(() => {
  const sectionSelector = '[data-qm-section]';
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contexts = new Map();

  const getGsap = () => window.gsap;
  const getScrollTrigger = () => window.ScrollTrigger;

  function revealStatic(root) {
    root.querySelectorAll('[data-qm-reveal], [data-qm-card], [data-qm-tile]').forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.visibility = '';
    });
  }

  function waitForGsap(callback, attempts = 30) {
    if (getGsap()) {
      callback();
      return;
    }

    if (attempts <= 0) return;
    window.setTimeout(() => waitForGsap(callback, attempts - 1), 100);
  }

  function initHero(root, gsap) {
    const title = root.querySelector('[data-qm-hero-title]');
    const copy = root.querySelectorAll('[data-qm-reveal]');
    const tiles = root.querySelectorAll('[data-qm-tile]');

    if (title) {
      gsap.from(title, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    if (copy.length) {
      gsap.from(copy, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.12
      });
    }

    if (tiles.length) {
      gsap.from(tiles, {
        autoAlpha: 0,
        y: 34,
        rotation: -3,
        scale: 0.96,
        duration: 0.75,
        stagger: 0.06,
        ease: 'back.out(1.3)',
        delay: 0.18
      });

      gsap.to(tiles, {
        y: (index) => (index % 2 === 0 ? -14 : 14),
        rotation: (index) => (index % 2 === 0 ? 1.5 : -1.5),
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.12
      });
    }
  }

  function initScrollReveals(root, gsap, ScrollTrigger, isDesktop) {
    const revealItems = root.querySelectorAll('[data-qm-reveal], [data-qm-card]');
    if (!revealItems.length || !ScrollTrigger) return;

    ScrollTrigger.batch(revealItems, {
      start: 'top 86%',
      once: true,
      batchMax: isDesktop ? 6 : 3,
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { autoAlpha: 0, y: isDesktop ? 30 : 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power2.out',
            overwrite: 'auto'
          }
        );
      }
    });
  }

  function initDesktopOnly(root, gsap, ScrollTrigger) {
    if (!ScrollTrigger) return;

    const tickerRows = root.querySelectorAll('[data-qm-ticker]');
    tickerRows.forEach((row, index) => {
      gsap.to(row, {
        xPercent: index % 2 === 0 ? -8 : 8,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  }

  function initSection(section) {
    if (!section || contexts.has(section)) return;

    if (reduceMotionQuery.matches || window.Shopify?.designMode) {
      revealStatic(section);
      return;
    }

    waitForGsap(() => {
      const gsap = getGsap();
      const ScrollTrigger = getScrollTrigger();

      if (!gsap) return;
      if (ScrollTrigger && !gsap.core.globals().ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const mm = gsap.matchMedia();
      contexts.set(section, mm);

      mm.add(
        {
          isDesktop: '(min-width: 990px)',
          isMobile: '(max-width: 989px)',
          reduceMotion: '(prefers-reduced-motion: reduce)'
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions;

          if (reduceMotion) {
            revealStatic(section);
            return;
          }

          if (section.dataset.qmSection === 'hero') {
            initHero(section, gsap);
          }

          initScrollReveals(section, gsap, ScrollTrigger, isDesktop);

          if (isDesktop) {
            initDesktopOnly(section, gsap, ScrollTrigger);
          }
        }
      );

      if (ScrollTrigger) {
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    });
  }

  function destroySection(section) {
    const context = contexts.get(section);
    if (context) {
      context.revert();
      contexts.delete(section);
    }
  }

  function initAll(root = document) {
    root.querySelectorAll(sectionSelector).forEach(initSection);
  }

  document.addEventListener('DOMContentLoaded', () => initAll());

  document.addEventListener('shopify:section:load', (event) => {
    initAll(event.target);
  });

  document.addEventListener('shopify:section:unload', (event) => {
    const section = event.target.querySelector(sectionSelector) || event.target.closest(sectionSelector);
    if (section) destroySection(section);
  });

  document.addEventListener('shopify:section:reorder', () => {
    if (getScrollTrigger()) getScrollTrigger().refresh();
  });
})();
