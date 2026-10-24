/* ==========================================================================
   interactions.js — navigation, modals, scroll reveal, stepper, cursor
   Every block is defensive: it checks the elements exist before wiring up,
   so one file can be shared by all pages.
   ========================================================================== */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------- 1. Reveal */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        if (!els.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            els.forEach(function (el) { el.classList.add('show'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(function (el) { observer.observe(el); });
    }

    /* --------------------------------------------------------- 2. Mobile menu */
    function initMobileMenu() {
        var toggle = document.getElementById('mobileMenuToggle');
        var panel = document.getElementById('mobileNavPanel');
        if (!toggle || !panel) return;
        var open = false;

        function set(openState) {
            open = openState;
            toggle.classList.toggle('menu-open', open);
            panel.classList.toggle('panel-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.classList.toggle('mobile-menu-open', open);
        }

        toggle.addEventListener('click', function () { set(!open); });

        panel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { set(false); });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && open) set(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024 && open) set(false);
        });
    }

    /* ------------------------------------------------------------ 3. Modals */
    function initModals() {
        var modals = document.querySelectorAll('.modal-overlay');
        if (!modals.length) return;
        var openId = null;

        function toggle(modal) {
            if (!modal) return;
            var opening = !modal.classList.contains('modal-active');
            modal.classList.toggle('modal-active');
            if (opening) {
                openId = modal.id;
                document.body.classList.add('modal-open');
            } else {
                openId = null;
                document.body.classList.remove('modal-open');
            }
        }

        // Triggers: any [data-modal="<id>"]
        document.querySelectorAll('[data-modal]').forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                toggle(document.getElementById(trigger.getAttribute('data-modal')));
            });
        });

        // Close buttons: [data-modal-close]
        document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                toggle(btn.closest('.modal-overlay'));
            });
        });

        // Click on the backdrop closes
        modals.forEach(function (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) toggle(modal);
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && openId) toggle(document.getElementById(openId));
        });
    }

    /* --------------------------------------------------- 4. Journey stepper */
    function initStepper() {
        var steps = document.querySelectorAll('.journey-node');
        if (!steps.length || reduceMotion) return;

        var total = steps.length;
        var current = 0;
        setInterval(function () {
            steps.forEach(function (s) { s.classList.remove('active-step'); });
            var node = document.querySelector('.journey-node[data-step="' + current + '"]');
            if (node) node.classList.add('active-step');
            current = (current + 1) % total;
        }, 2000);
    }

    /* ------------------------------------------------- 5. Optional cursor */
    function initCursor() {
        var finePointer = window.matchMedia('(pointer: fine)').matches;
        var dot = document.getElementById('cDot');
        var ring = document.getElementById('cRing');
        // Only ever enable on devices with a real pointer, and never when the
        // user prefers reduced motion. The native cursor is otherwise kept.
        if (!finePointer || reduceMotion || !dot || !ring) return;

        document.documentElement.classList.add('cursor-ready');

        var mx = 0, my = 0, rx = 0, ry = 0, raf = null;

        function onMove(e) { mx = e.clientX; my = e.clientY; }
        window.addEventListener('mousemove', onMove, { passive: true });

        function loop() {
            dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
            raf = requestAnimationFrame(loop);
        }
        loop();

        function enter() { ring.classList.add('hover-state'); dot.classList.add('hover-state'); }
        function leave() { ring.classList.remove('hover-state'); dot.classList.remove('hover-state'); }

        document.querySelectorAll('a, button, .cursor-link, details summary').forEach(function (el) {
            el.addEventListener('mouseenter', enter);
            el.addEventListener('mouseleave', leave);
        });

        // Pause the loop when the tab is hidden.
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (raf) { cancelAnimationFrame(raf); raf = null; }
            } else if (!raf) {
                loop();
            }
        });
    }

    /* ------------------------------------------------------- 6. Footer year */
    function initYear() {
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    function boot() {
        initReveal();
        initMobileMenu();
        initModals();
        initStepper();
        initCursor();
        initYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
