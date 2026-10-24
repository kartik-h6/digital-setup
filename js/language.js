/* ==========================================================================
   language.js — English / Kannada switcher
   --------------------------------------------------------------------------
   Strategy: the site ships both languages in the markup.
     .lang-en  -> English copy
     .lang-kn  -> Kannada copy (hidden by default via .lang-hidden)
   Toggling adds/removes .lang-kn-active on <body>; CSS does the rest.

   Fallback: any English element that has no Kannada counterpart is tagged
   data-no-kn and stays visible in Kannada mode, so a section is never blank.

   The chosen language is remembered in localStorage and re-applied on every
   page, so switching on one page carries across the whole site.
   ========================================================================== */
(function () {
    'use strict';

    var STORAGE_KEY = 'tshc-lang';
    var body = document.body;

    function readStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function store(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    }

    function apply(lang) {
        var isKn = lang === 'kn';
        body.classList.toggle('lang-kn-active', isKn);
        document.documentElement.lang = isKn ? 'kn' : 'en';

        // Label shows the language you will switch TO.
        var label = document.getElementById('langLabel');
        if (label) label.textContent = isKn ? 'ENGLISH' : 'ಕನ್ನಡ';

        var btn = document.getElementById('langToggle');
        if (btn) {
            btn.setAttribute('aria-label',
                isKn ? 'Switch language to English' : 'Switch language to Kannada');
        }
    }

    function current() {
        return body.classList.contains('lang-kn-active') ? 'kn' : 'en';
    }

    function init() {
        // Apply the stored preference before the first paint of content.
        apply(readStored() === 'kn' ? 'kn' : 'en');

        var btn = document.getElementById('langToggle');
        if (btn) {
            btn.addEventListener('click', function () {
                var next = current() === 'kn' ? 'en' : 'kn';
                apply(next);
                store(next);
            });
        }
    }

    // Expose for other scripts / tests.
    window.TSHC = window.TSHC || {};
    window.TSHC.setLang = function (lang) { apply(lang); store(lang); };
    window.TSHC.getLang = current;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
