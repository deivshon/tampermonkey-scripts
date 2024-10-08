// ==UserScript==
// @name         wiki-vector-skin
// @namespace    https://github.com/deivshon
// @downloadURL  https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/wiki-vector-skin/wiki-vector-skin.user.js
// @updateURL    https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/wiki-vector-skin/wiki-vector-skin.user.js
// @version      1.0.1
// @description  Set matching Wiki's links skin to vector
// @author       Davide Cioni
// @match        https://wiki.archlinux.org/title/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

"use strict";

(() => {
    const SKIN_PARAM_KEY = "useskin";
    const SKIN_PARAM_VALUE = "vector";

    const url = new URL(window.location.href);
    if (url.searchParams.get(SKIN_PARAM_KEY) === SKIN_PARAM_VALUE) {
        return;
    }

    url.searchParams.set("useskin", "vector");
    window.location.href = url.toString();
    history.replaceState(null, "", url);
})();
