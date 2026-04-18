// ==UserScript==
// @name         Fix Duckduckgo entry field lost focus on system hotkey (as Win-Space )
// @namespace    https://github.com/mmv-ru/duckduckgo-buttons
// @version      1.0
// @description  Fix bug at duckduckgo.com - lost entry field focus on change keyboard laout
// @author       MMV (Qwen assisted)
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/duckduckgo-fix-focus.user.js
// @downloadURL  https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/duckduckgo-fix-focus.user.js
// @supportURL   https://github.com/mmv-ru/duckduckgo-buttons/issues
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';

    function getSearchInput() {
        return document.querySelector('#search_form_input, #searchbox_input, input[name="q"]');
    }

    function setupFocusFix() {
        const input = getSearchInput();
        if (!input || input.dataset.focusFixAttached) return;
        input.dataset.focusFixAttached = 'true';

        let restoreTimeout = null;
        let isMouseDown = false;
        let isEscapeTriggered = false; // Флаг для Esc

        // Отслеживаем мышь, чтобы не мешать кликам по подсказкам/странице
        document.addEventListener('mousedown', () => { isMouseDown = true; });
        document.addEventListener('mouseup', () => {
            setTimeout(() => { isMouseDown = false; }, 50);
        });

        // Обработка Esc
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                isEscapeTriggered = true;
                input.blur(); // Снимаем фокус
            }
        });

        input.addEventListener('focusout', (e) => {
            // 1. Если фокус ушёл из-за Esc → ничего не восстанавливаем
            if (isEscapeTriggered) {
                isEscapeTriggered = false;
                clearTimeout(restoreTimeout);
                return;
            }

            // 2. Если потеря фокуса вызвана кликом мыши → не вмешиваемся
            if (isMouseDown) return;

            // 3. Проверяем, куда ушёл фокус
            const target = e.relatedTarget;
            const lostToNowhere = !target || target === document.body || target === document.documentElement;

            if (lostToNowhere) {
                clearTimeout(restoreTimeout);
                // Ждём, пока ОС закроет оверлей переключения раскладки
                restoreTimeout = setTimeout(() => {
                    const active = document.activeElement;
                    if (active === document.body || active === document.documentElement) {
                        input.focus();
                    }
                }, 60);
            }
        });

        // Если пользователь вручную вернул фокус (Tab, клик) → отменяем таймер восстановления
        document.addEventListener('focusin', () => {
            clearTimeout(restoreTimeout);
        });
    }

    // Адаптация под SPA-навигацию DDG (поиск без перезагрузки)
    const observer = new MutationObserver(() => {
        if (getSearchInput()) setupFocusFix();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setupFocusFix();
})();
