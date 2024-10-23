// ==UserScript==
// @name         svelte-docs-tweak-fonts
// @namespace    https://github.com/deivshon
// @downloadURL  https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/svelte-docs-tweak-fonts/svelte-docs-tweak-fonts.user.js
// @updateURL    https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/svelte-docs-tweak-fonts/svelte-docs-tweak-fonts.user.js
// @version      1.0.0
// @description  Disable serif fonts on Svelte docs
// @author       Davide Cioni
// @match        https://svelte.dev/docs/*
// @grant        none
// ==/UserScript==

"use strict";

(() => {
    const FIRA_SANS = "Fira Sans";

    /**
     * @type {Array<[string, string]>}
     */
    const replacements = [
        ["Georgia,serif", FIRA_SANS],
        ["DM Serif Display", FIRA_SANS],
    ];

    /**
     *
     * @param {string} str
     * @param {Array<[string, string]>} replacements
     * @returns {string}
     */
    const replaceMultiple = (str, replacements) => {
        if (replacements.length === 0) {
            return str;
        }

        return replaceMultiple(
            str.replace(replacements[0][0], replacements[0][1]),
            replacements.slice(1),
        );
    };

    const styles = getComputedStyle(document.documentElement);

    for (let i = 0; i < styles.length; i++) {
        const property = styles[i];
        if (!property.startsWith("--")) {
            continue;
        }

        const currentValue = styles.getPropertyValue(property).trim();
        document.documentElement.style.setProperty(
            property,
            replaceMultiple(currentValue, replacements),
        );
    }
})();
