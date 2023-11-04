// ==UserScript==
// @name         browser-leaks-run-dns-test
// @namespace    https://github.com/deivshon
// @version      1.0
// @description  Automatically run the DNS test on browserleaks's IP page
// @author       Davide Cioni
// @match        https://browserleaks.com/ip
// @grant        none
// ==/UserScript==

"use strict";

const main = () => {
    const dnsTestButton = document.getElementById("dns-run");
    dnsTestButton.click();
};

main();
