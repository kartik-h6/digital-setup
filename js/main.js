/* ==========================================================================
   main.js — site configuration helpers
   Centralises the contact endpoints so the WhatsApp number and onboarding
   form live in ONE place, and every CTA stays consistent.
   ========================================================================== */
(function () {
    'use strict';

    var SITE = {
        whatsapp: '919480727214',
        // Prefilled first message (kept short so it renders well in WhatsApp).
        waMessage: "Hello TECHSTUDYHUBCORE, I'm interested in setting up a " +
                   "professional online presence for my business. Please help me " +
                   "understand the suitable package, pricing and next steps.",
        form: 'https://forms.gle/dDr35dUyyjNQ6ArCA'
    };

    function waHref(message) {
        return 'https://wa.me/' + SITE.whatsapp +
               '?text=' + encodeURIComponent(message || SITE.waMessage);
    }

    function boot() {
        // Any anchor with [data-wa] gets the central WhatsApp deep link.
        document.querySelectorAll('a[data-wa]').forEach(function (a) {
            var custom = a.getAttribute('data-wa-message');
            a.href = waHref(custom || null);
            a.target = '_blank';
            a.rel = 'noopener';
        });

        // Any anchor with [data-form] gets the onboarding form link.
        document.querySelectorAll('a[data-form]').forEach(function (a) {
            a.href = SITE.form;
            a.target = '_blank';
            a.rel = 'noopener';
        });

        // Copy-to-clipboard for [data-copy]
        document.querySelectorAll('[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var value = btn.getAttribute('data-copy');
                var done = function () {
                    var original = btn.textContent;
                    btn.textContent = 'Copied';
                    setTimeout(function () { btn.textContent = original; }, 1600);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(value).then(done).catch(function () {});
                }
            });
        });
    }

    window.TSHC = window.TSHC || {};
    window.TSHC.SITE = SITE;
    window.TSHC.waHref = waHref;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
