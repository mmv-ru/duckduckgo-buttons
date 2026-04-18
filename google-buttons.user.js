// ==UserScript==
// @name         Google to DDG & Yandex Buttons
// @namespace    https://github.com/mmv-ru/duckduckgo-buttons
// @version      1.0
// @description  Add DuckDuckGo and Yandex buttons to Google search
// @author       MMV (Lenny32)
// @match        https://www.google.com/search?*
// @match        https://www.google.com/
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @updateURL    https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/google-buttons.user.js
// @downloadURL  https://raw.githubusercontent.com/mmv-ru/duckduckgo-buttons/main/google-buttons.user.js
// @supportURL   https://github.com/mmv-ru/duckduckgo-buttons/issues
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function addSearchButtons() {
        // Если кнопки уже добавлены, выходим
        if (document.querySelector('#tm-ddg-search-btn') && 
            document.querySelector('#tm-yandex-search-btn')) return;

        // Находим поле ввода Google (поддержка input и textarea)
        const input = document.querySelector('input[name="q"], textarea[name="q"]');
        if (!input) return;

        // Создаём контейнер для кнопок, если его ещё нет
        let btnContainer = document.querySelector('.tm-buttons-wrapper');
        if (!btnContainer) {
            btnContainer = document.createElement('div');
            btnContainer.className = 'tm-buttons-wrapper';
            btnContainer.style.display = 'inline-flex';
            btnContainer.style.marginLeft = '10px';
            btnContainer.style.alignItems = 'center';
            // Вставляем сразу после поискового поля
            input.after(btnContainer);
        }

        // 1️⃣ Внедряем CSS только один раз
        if (!document.getElementById('tm-google-ext-style')) {
            const style = document.createElement('style');
            style.id = 'tm-google-ext-style';
            style.textContent = `
                .tm-ext-btn {
                    margin-left: 6px;
                    padding: 0 8px;
                    border-radius: 999px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    font-size: 11px;
                    height: 26px;
                    background: transparent;
                    white-space: nowrap;
                    box-sizing: border-box;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    outline: none;
                    user-select: none;
                }
                /* Лёгкий фон при наведении (как у элементов Google) */
                .tm-ext-btn:hover {
                    background: #f5f5f5;
                }
                /* HOVER: DuckDuckGo */
                .tm-btn-ddg:hover {
                    background: #DE5833;
                    color: #fff;
                    border-color: #DE5833;
                    box-shadow: 0 2px 6px rgba(222, 88, 51, 0.3);
                }
                /* HOVER: Яндекс */
                .tm-btn-yandex:hover {
                    background: #FF0000;
                    color: #fff;
                    border-color: #FF0000;
                    box-shadow: 0 2px 6px rgba(255, 0, 0, 0.3);
                }
                /* Адаптация под тёмную тему Google */
                @media (prefers-color-scheme: dark) {
                    .tm-ext-btn { color: #aaa; }
                    .tm-ext-btn:hover { background: #333; }
                }
            `;
            document.head.appendChild(style);
        }

        // 2️⃣ Функция создания кнопки
        function createButton(id, extraClass, text, urlBuilder) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = id;
            btn.className = `tm-ext-btn ${extraClass}`;
            btn.textContent = text;

            btn.addEventListener('click', () => {
                const q = input.value.trim();
                if (!q) return;
                window.open(urlBuilder(q), '_blank');
            });

            return btn;
        }

        // 3️⃣ Создаём и добавляем кнопки
        const ddgBtn = createButton('tm-ddg-search-btn', 'tm-btn-ddg', 'DDG',
            q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`);
        
        const yaBtn = createButton('tm-yandex-search-btn', 'tm-btn-yandex', 'Яндекс',
            q => `https://yandex.ru/search/?text=${encodeURIComponent(q)}`);

        btnContainer.appendChild(ddgBtn);
        btnContainer.appendChild(yaBtn);
    }

    // Наблюдатель + первичный запуск
    const observer = new MutationObserver(addSearchButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    addSearchButtons();
})();
