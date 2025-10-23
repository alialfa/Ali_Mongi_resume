/**
 * Modern Vanilla JavaScript - No jQuery Dependencies
 * Smooth scroll navigation and mobile menu handling
 */

(function () {
  'use strict';

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');

      // Toggle icon
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Only handle hash links
      if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Close mobile menu if open
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (mobileMenuToggle) {
              mobileMenuToggle.setAttribute('aria-expanded', 'false');
              const icon = mobileMenuToggle.querySelector('i');
              if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
              }
            }
          }

          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });

          // Update URL without page jump
          if (history.pushState) {
            history.pushState(null, null, href);
          } else {
            window.location.hash = href;
          }
        }
      }
    });
  });

  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('#sideNav .nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobileNav .mobile-nav-link');

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active from all links
        desktopNavLinks.forEach(function (link) {
          link.classList.remove('active');
        });
        mobileNavLinks.forEach(function (link) {
          link.classList.remove('active');
        });

        // Add active to current section links
        const activeDesktopLink = document.querySelector(
          '#sideNav .nav-link[href="#' + sectionId + '"]'
        );
        const activeMobileLink = document.querySelector(
          '#mobileNav .mobile-nav-link[href="#' + sectionId + '"]'
        );

        if (activeDesktopLink) {
          activeDesktopLink.classList.add('active');
        }
        if (activeMobileLink) {
          activeMobileLink.classList.add('active');
        }
      }
    });
  }

  // Throttle scroll event for better performance
  let scrollTimeout;
  window.addEventListener('scroll', function () {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(function () {
      updateActiveLink();
    });
  });

  // Initialize active link on page load
  updateActiveLink();

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function () {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  });
})();
