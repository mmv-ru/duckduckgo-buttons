// ==UserScript==
// @name        DuckduckGo to Google & Yandex (Forked from Lenny32/duckduckgo-google-button)
// @namespace   Violentmonkey Scripts
// @match        https://duckduckgo.com/?q=*
// @match        https://duckduckgo.com/?*&q=*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=duckduckgo.com
// @grant       none
// @version     1.0 18.04.2026, 21:06:40
// @author      MMV (Lenny32)
// @description Add a Google & Yandex buttons for direct redirection from DuckDuckGo search results (forked from Lenny32/duckduckgo-google-button)
// @updateURL    https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/duckduckgo-google-button.user.js
// @downloadURL  https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/duckduckgo-google-button.user.js
// @supportURL   https://github.com/mmv-ru/duckduckgo-buttons/issues
// @license      MIT
// ==/UserScript==


(function () {
    'use strict';

    function addSearchButtons() {
        // Если кнопки уже добавлены, выходим
        if (document.querySelector('#tm-google-search-btn') &&
            document.querySelector('#tm-yandex-search-btn')) return;

        const form  = document.querySelector('#search_form');
        const input = document.querySelector('#search_form_input');
        if (!form || !input) return;

        const ddgButton = form.querySelector('button[type="submit"]');
        if (!ddgButton) return;

        // 1️⃣ Внедряем CSS только один раз
        if (!document.getElementById('tm-search-btns-style')) {
            const style = document.createElement('style');
            style.id = 'tm-search-btns-style';
            style.textContent = `
                .tm-search-btn {
                    margin-left: 6px;
                    padding: 0 8px;
                    border-radius: 999px;
                    border: 1px solid transparent; /* Рамка прозрачная, чтобы размер не прыгал при hover */
                    cursor: pointer;
                    font-size: 11px;
                    height: 26px;
                    background: transparent;
                    white-space: nowrap;
                    box-sizing: border-box;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #666; /* Серый шрифт по умолчанию */
                    font-weight: 500;
                    transition: all 0.2s ease;
                    outline: none;
                    user-select: none;
                }
                /* Лёгкий фон при наведении (как у кнопок DDG) */
                .tm-search-btn:hover {
                    background: #f5f5f5;
                }
                /* HOVER: Google */
                .tm-btn-google:hover {
                    background: #4285F4;
                    color: #fff;
                    border-color: #4285F4;
                    box-shadow: 0 2px 6px rgba(66, 133, 244, 0.3);
                }
                /* HOVER: Яндекс */
                .tm-btn-yandex:hover {
                    background: #FF0000;
                    color: #fff;
                    border-color: #FF0000;
                    box-shadow: 0 2px 6px rgba(255, 0, 0, 0.3);
                }
                /* Адаптация под тёмную тему DDG */
                @media (prefers-color-scheme: dark) {
                    .tm-search-btn { color: #aaa; }
                    .tm-search-btn:hover { background: #333; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2️⃣ Функция создания кнопки (только логика, без инлайн-стилей)
        function createButton(id, extraClass, text, urlBuilder) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = id;
            btn.className = `tm-search-btn ${extraClass}`;
            btn.textContent = text;

            btn.addEventListener('click', () => {
                const q = input.value.trim();
                if (!q) return;
                window.open(urlBuilder(q), '_blank');
            });

            return btn;
        }

        // 3️⃣ Создаём и вставляем кнопки
        const googleBtn = createButton('tm-google-search-btn', 'tm-btn-google', 'Google',
            q => `https://www.google.com/search?q=${encodeURIComponent(q)}`);

        const yandexBtn = createButton('tm-yandex-search-btn', 'tm-btn-yandex', 'Яндекс',
            q => `https://yandex.ru/search/?text=${encodeURIComponent(q)}`);

        ddgButton.parentNode.insertBefore(googleBtn, ddgButton.nextSibling);
        ddgButton.parentNode.insertBefore(yandexBtn, googleBtn.nextSibling);
    }

    // Наблюдатель + первичный запуск
    const observer = new MutationObserver(addSearchButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    addSearchButtons();
})();
