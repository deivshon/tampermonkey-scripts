// ==UserScript==
// @name         mullvad-check-expand-boxes
// @namespace    https://github.com/deivshon
// @version      1.0
// @description  Automatically expand the boxes in the Mullvad check site
// @author       Davide Cioni
// @match        https://mullvad.net/*/check
// @grant        none
// ==/UserScript==

"use strict";

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const stillLoading = (box) => {
  return box.classList.contains("bg-loading");
};

const isActualBox = (box) => {
  return (
    box.classList.contains("bg-warning") ||
    box.classList.contains("bg-danger") ||
    box.classList.contains("bg-loading") ||
    box.classList.contains("bg-success")
  );
};

const main = async () => {
  let boxes = [];

  while (boxes.length !== 4) {
    boxes = document.getElementsByTagName("header");
    boxes = Array.prototype.slice.call(boxes);
    boxes = boxes.filter((b) => isActualBox(b));
    await sleep(100);
  }

  while (boxes.length > 0) {
    for (let i = 0; i < boxes.length; i++) {
      if (!stillLoading(boxes[i])) {
        boxes[i].click();
        boxes.splice(i, 1);
        i--;
      }
    }
    await sleep(100);
  }
};

main();
