import jsdocPlugin from "eslint-plugin-jsdoc";
import userscripts from "eslint-plugin-userscripts";
import globals from "globals";

export default [
    {
        files: ["**/*.js"],
        plugins: {
            jsdoc: jsdocPlugin,
            userscripts: {
                rules: userscripts.rules,
            },
        },
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "jsdoc/check-alignment": "warn",
            "jsdoc/check-indentation": "warn",
            "jsdoc/check-param-names": "error",
            "jsdoc/check-tag-names": "error",
            "jsdoc/check-types": "error",
            "jsdoc/no-types": "off",
            "jsdoc/no-undefined-types": "error",
            "jsdoc/require-jsdoc": "error",
            "jsdoc/require-param": "error",
            "jsdoc/require-param-type": "error",
            "jsdoc/require-returns": "error",
            "jsdoc/require-returns-type": "error",
            ...userscripts.configs.recommended.rules,
        },
    },
];
