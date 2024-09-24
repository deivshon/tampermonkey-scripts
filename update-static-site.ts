import { readdir, readFile, writeFile } from "fs/promises";
import { join, resolve } from "path";

type Userscript = {
    name: string;
    description: string;
    version: string;
    downloadUrl: string;
};

const findFiles = async (
    dirPath: string,
    regex: RegExp,
): Promise<Array<string>> => {
    const files: Array<string> = [];

    const traverseDirectory = async (currentPath: string) => {
        const entries = await readdir(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const entryPath = join(currentPath, entry.name);

            if (entry.isDirectory()) {
                await traverseDirectory(entryPath);
            } else if (entry.isFile() && regex.test(entryPath)) {
                files.push(resolve(entryPath));
            }
        }
    };

    await traverseDirectory(dirPath);
    return files;
};

const parseUserscript = async (
    filePath: string,
): Promise<Userscript | null> => {
    const startRegex = /^\/\/\s*==UserScript==\s*$/;
    const endRegex = /^\/\/\s*==\/UserScript==\s*$/;

    const fileLines = (await readFile(filePath, "utf8")).split("\n");

    const startLineIndex = fileLines.findIndex((l) => startRegex.test(l));
    const endLineIndex = fileLines.findIndex((l) => endRegex.test(l));
    if (startLineIndex === -1 || endLineIndex === -1) {
        return null;
    }

    const userscriptHeaderLines: Array<string> = fileLines.slice(
        startLineIndex,
        endLineIndex + 1,
    );

    const nameRegex = /\/\/\s*@name[^s]\s*(.*)$/;
    const descriptionRegex = /\/\/\s*@description\s*(.*)$/;
    const versionRegex = /\/\/\s*@version\s*(.*)$/;
    const downloadUrlRegex = /\/\/\s*@downloadURL\s*(.*)$/;
    const execUserscriptHeaderRegex = (regex: RegExp, str: string) => {
        const result = regex.exec(str);
        const captured = result?.at(1);
        if (captured === undefined) {
            return null;
        }

        return captured;
    };

    const acc: Partial<Userscript> = {};
    const partialResult: Partial<Userscript> = userscriptHeaderLines.reduce(
        (prev, curr) => {
            const nameResult = execUserscriptHeaderRegex(nameRegex, curr);
            const descriptionResult = execUserscriptHeaderRegex(
                descriptionRegex,
                curr,
            );
            const versionResult = execUserscriptHeaderRegex(versionRegex, curr);
            const downloadUrlResult = execUserscriptHeaderRegex(
                downloadUrlRegex,
                curr,
            );

            if (nameResult !== null) {
                return {
                    ...prev,
                    name: nameResult,
                };
            }
            if (descriptionResult !== null) {
                return {
                    ...prev,
                    description: descriptionResult,
                };
            }
            if (versionResult !== null) {
                return {
                    ...prev,
                    version: versionResult,
                };
            }
            if (downloadUrlResult !== null) {
                return {
                    ...prev,
                    downloadUrl: downloadUrlResult,
                };
            }

            return prev;
        },
        acc,
    );

    if (
        typeof partialResult.name === "string" &&
        typeof partialResult.description === "string" &&
        typeof partialResult.version === "string" &&
        typeof partialResult.downloadUrl === "string"
    ) {
        return {
            name: partialResult.name,
            description: partialResult.description,
            version: partialResult.version,
            downloadUrl: partialResult.downloadUrl,
        };
    }

    return null;
};

const makeHtmlCard = (userscript: Userscript) => {
    const nameKey = "{{USERSCRIPT_NAME}}";
    const descriptionKey = "{{USERSCRIPT_DESCRIPTION}}";
    const versionKey = "{{USERSCRIPT_VERSION}}";
    const hrefKey = "{{USERSCRIPT_HREF}}";

    const template = `                <div class="card">
                    <h2 class="script-name">${nameKey}</h2>
                    <p class="script-description">${descriptionKey}</p>
                    <p class="script-version">Version: ${versionKey}</p>
                    <a class="script-link" href="${hrefKey}" target="_blank">Get it</a>
                </div>`;

    return template
        .replace(nameKey, userscript.name)
        .replace(descriptionKey, userscript.description)
        .replace(versionKey, userscript.version)
        .replace(hrefKey, userscript.downloadUrl);
};

const replaceScriptContent = async (
    filePath: string,
    newContent: string,
): Promise<void> => {
    const data = await readFile(filePath, "utf8");

    const startIndex = data.indexOf("<!-- SCRIPTS START -->");
    const endIndex = data.indexOf("<!-- SCRIPTS END -->");

    if (startIndex === -1 || endIndex === -1) {
        console.error(
            `Could not find scripts start/end comments in file (${filePath})`,
        );
        return;
    }

    const newData =
        data.substring(0, startIndex + "<!-- SCRIPTS START -->".length) +
        newContent +
        data.substring(endIndex);

    await writeFile(filePath, newData);
};

(async () => {
    const userscriptPaths = await findFiles(join(".", "src"), /.*\.user\.js$/);
    if (userscriptPaths.length === 0) {
        throw new Error("Found no userscripts file paths");
    }

    const userscripts = await Promise.all(userscriptPaths.map(parseUserscript));
    const userscriptCards = await Promise.all(
        userscripts.filter((u) => u !== null).map(makeHtmlCard),
    );
    if (userscriptCards.length === 0) {
        throw new Error("no resulting userscript html cards from mapping");
    }

    replaceScriptContent("index.html", userscriptCards.join("\n"));
})();
