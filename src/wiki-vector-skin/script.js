// ==UserScript==
// @name         wiki-vector-skin
// @namespace    https://github.com/deivshon
// @version      1.0
// @description  Set matching Wiki's links skin to vector
// @author       Davide Cioni
// @match        https://wiki.archlinux.org/title/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

"use strict";

const KEY_IDX = 0;
const VALUE_IDX = 1;

const SKIN_QUERY_KEY = "useskin";
const SKIN_QUERY_VALUE = "vector";

const parseQuery = (queryArray) => {
  const queryMap = {};
  for (const keyValuePair of queryArray) {
    const split = keyValuePair.split("=");
    if (split.length !== 2) continue;

    queryMap[split[KEY_IDX]] = split[VALUE_IDX];
  }

  return queryMap;
};

const buildQuery = (queryMap) => {
  let query = "";
  for (const key of Object.keys(queryMap)) {
    query += `${key}=${queryMap[key]}&`;
  }

  return query.slice(0, query.length - 1);
};

const getFixedUrl = (url) => {
  const queryIndex = url.indexOf("?");
  const pointerIndex = url.indexOf("#");

  if (queryIndex === -1 && pointerIndex === -1) {
    return `${url}?${SKIN_QUERY_KEY}=${SKIN_QUERY_VALUE}`;
  }

  let leftOfQuery;
  let query;
  let pointer;

  if (pointerIndex === -1) {
    pointer = "";
  } else {
    pointer = url.slice(pointerIndex + 1, url.length);
  }

  if (queryIndex === -1) {
    query = "";
  } else if (pointerIndex === -1) {
    query = url.slice(queryIndex + 1, url.length);
  } else {
    query = url.slice(queryIndex + 1, pointerIndex);
  }

  if (queryIndex !== -1) {
    leftOfQuery = url.slice(0, queryIndex);
  } else if (pointerIndex !== -1) {
    leftOfQuery = url.slice(0, pointerIndex);
  } else {
    leftOfQuery = url;
  }

  const queryArray = query.split("&");
  const queryMap = parseQuery(queryArray);
  if (queryMap[SKIN_QUERY_KEY] == SKIN_QUERY_VALUE) {
    return null;
  }

  queryMap[SKIN_QUERY_KEY] = SKIN_QUERY_VALUE;

  query = `?${buildQuery(queryMap)}`;

  if (pointer !== "") pointer = `#${pointer}`;
  return `${leftOfQuery}${query}${pointer}`;
};

const main = () => {
  const url = window.location.href;
  const newUrl = getFixedUrl(url);
  if (newUrl === null) return;

  window.location.href = newUrl;
};

main();
