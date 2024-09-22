// ==UserScript==
// @name         browser-leaks-run-dns-test
// @namespace    https://github.com/deivshon
// @downloadURL  https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/browser-leaks-run-dns-test/script.js
// @version      1.0.1
// @description  Automatically run the DNS test on browserleaks's IP page
// @author       Davide Cioni
// @match        https://browserleaks.com/ip
// @grant        none
// ==/UserScript==

"use strict";

(() => {
    const dnsTestButton = document.getElementById("dns-run");
    if (!dnsTestButton) {
        console.error("Could not find the DNS test button");
        return;
    }

    dnsTestButton.click();
})();
