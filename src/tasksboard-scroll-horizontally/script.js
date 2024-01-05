// ==UserScript==
// @name         tasksboard-scroll-horizontally
// @namespace    https://github.com/deivshon
// @version      1.0
// @description  Enable horizontal scrolling on Tasksboard
// @author       Davide Cioni
// @match        https://tasksboard.com/app
// @grant        none
// ==/UserScript==
"use strict";

const enableHorizontalScrolling = () => {
    window.addEventListener("wheel", (e) => {
        window.scrollBy({
            top: 0,
            left: e.deltaY,
            behavior: "auto",
        });
    });
};

enableHorizontalScrolling();
