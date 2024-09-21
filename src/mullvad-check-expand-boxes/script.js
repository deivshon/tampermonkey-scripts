// ==UserScript==
// @name         mullvad-check-expand-boxes
// @namespace    https://github.com/deivshon
// @version      1.0.2
// @description  Automatically expand the boxes in the Mullvad check site
// @author       Davide Cioni
// @match        https://mullvad.net/*/check
// @grant        none
// ==/UserScript==

"use strict";

(async () => {
    const BOXES_AMOUNT = 3;
    let boxesCount = 0;

    /** @type {MutationObserver | null} */
    let documentTreeObserver = null;

    /**
     *
     * @param {HTMLElement} box
     * @returns {boolean}
     */
    const isLoading = (box) => {
        return box.classList.contains("bg-loading");
    };

    /**
     *
     * @param {HTMLElement} box
     * @returns {boolean}
     */
    const isActualBox = (box) => {
        return (
            box.classList.contains("bg-warning") ||
            box.classList.contains("bg-danger") ||
            box.classList.contains("bg-loading") ||
            box.classList.contains("bg-success")
        );
    };

    /**
     *
     * @param {HTMLElement} box
     * @returns {"finished" | "loading"}
     */
    const check = (box) => {
        if (isLoading(box)) {
            return "loading";
        }

        box.click();
        boxesCount++;
        if (boxesCount >= BOXES_AMOUNT && documentTreeObserver !== null) {
            documentTreeObserver.disconnect();
        }
        return "finished";
    };

    /**
     *
     * @param {HTMLElement} box
     */
    const listenBox = (box) => {
        const classListObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const { target } = mutation;
                if (
                    mutation.type !== "attributes" ||
                    !(target instanceof HTMLElement)
                ) {
                    continue;
                }

                if (!(target instanceof HTMLElement) || !isActualBox(target)) {
                    continue;
                }

                if (isLoading(target)) {
                    continue;
                }

                const result = check(target);
                if (result === "finished") {
                    classListObserver.disconnect();
                }
            }
        });
        classListObserver.observe(box, { attributes: true });
    };

    documentTreeObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type !== "childList") {
                continue;
            }

            for (const node of mutation.addedNodes) {
                if (
                    !(node instanceof HTMLElement) ||
                    !node.classList.contains("header")
                ) {
                    continue;
                }

                listenBox(node);
            }
        }
    });
    documentTreeObserver.observe(document.body, {
        subtree: true,
        childList: true,
    });
})();
