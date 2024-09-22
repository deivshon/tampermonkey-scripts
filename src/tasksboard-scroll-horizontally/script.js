// ==UserScript==
// @name         tasksboard-scroll-horizontally
// @namespace    https://github.com/deivshon
// @downloadURL  https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/tasksboard-scroll-horizontally/script.js
// @version      1.0.1
// @description  Enable horizontal scrolling on Tasksboard
// @author       Davide Cioni
// @match        https://tasksboard.com/app
// @grant        none
// ==/UserScript==

"use strict";

(() => {
    window.addEventListener("wheel", (e) => {
        window.scrollBy({
            top: 0,
            left: e.deltaY,
            behavior: "auto",
        });
    });
})();
