// ==UserScript==
// @name         youtube-persist-captions-settings
// @namespace    https://github.com/deivshon
// @downloadURL  https://raw.githubusercontent.com/deivshon/tampermonkey-scripts/refs/heads/main/src/youtube-persist-captions-settings/script.js
// @version      1.0.0
// @description  Persist YouTube captions settings forever instead of the standard 30 days
// @author       Davide Cioni
// @match        https://*.youtube.com
// @match        https://*.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

"use strict";

(() => {
    /**
     * @typedef {{ creation: number, expiration: number }} YTCaptionSettings
     */

    const CAPTIONS_SETTINGS = "yt-player-caption-display-settings";
    const CREATION_TIMESTAMP_KEY = "creation";
    const EXPIRATION_TIMESTAMP_KEY = "expiration";

    const settingsExist = localStorage.getItem(CAPTIONS_SETTINGS) !== null;
    if (!settingsExist) {
        return;
    }

    /**
     *
     * @param {string} msg
     * @returns {void}
     */
    const logError = (msg) => {
        console.error(`youtube-persist-captions-settings: ${msg}`);
    };

    /**
     *
     * @returns {NonNullable<object> | null}
     */
    const getRawCaptionSettingsFromStorage = () => {
        const rawCaptionSettings = localStorage.getItem(CAPTIONS_SETTINGS);
        if (!rawCaptionSettings) {
            return null;
        }

        try {
            /** @type {unknown} */
            const parsedSettings = JSON.parse(rawCaptionSettings);
            if (typeof parsedSettings !== "object" || parsedSettings === null) {
                return null;
            }

            return parsedSettings;
        } catch (e) {
            logError(`could not retrieve caption settings: ${e}`);
            return null;
        }
    };

    /**
     *
     * @param {YTCaptionSettings} settings
     * @returns {void}
     */
    const storeCaptionSettings = (settings) => {
        try {
            localStorage.setItem(CAPTIONS_SETTINGS, JSON.stringify(settings));
        } catch (e) {
            logError(`could not store settings: ${e}`);
            return;
        }
    };

    /** @type {YTCaptionSettings | null} */
    const timeRelatedCaptionSettings = (() => {
        const rawSettings = getRawCaptionSettingsFromStorage();
        if (
            rawSettings === null ||
            !(CREATION_TIMESTAMP_KEY in rawSettings) ||
            !(EXPIRATION_TIMESTAMP_KEY in rawSettings)
        ) {
            return null;
        }

        const parsedCreation = rawSettings[CREATION_TIMESTAMP_KEY];
        const parsedExpiration = rawSettings[EXPIRATION_TIMESTAMP_KEY];
        if (
            typeof parsedCreation !== "number" ||
            typeof parsedExpiration !== "number"
        ) {
            return null;
        }

        return {
            creation: parsedCreation,
            expiration: parsedExpiration,
        };
    })();

    if (timeRelatedCaptionSettings === null) {
        logError("could not retrieve time related caption settings");
        return;
    }

    const now = Date.now();
    const currentRawSettings = getRawCaptionSettingsFromStorage();
    if (!currentRawSettings) {
        logError(
            "could not retrieve caption settings as base for updated settings",
        );
        return;
    }

    /** @type {YTCaptionSettings} */
    const updatedTimeRelatedSettings = {
        creation: now,
        expiration: now + 1000 * 60 * 60 * 24 * 365 * 200,
    };

    const updatedSettings = {
        ...currentRawSettings,
        ...updatedTimeRelatedSettings,
    };
    storeCaptionSettings(updatedSettings);
})();
