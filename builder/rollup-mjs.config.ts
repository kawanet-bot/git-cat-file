import nodeResolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import type {RollupOptions} from "rollup"
import {showFiles} from "./show-files.ts"

const rollupConfig: RollupOptions = {
    input: "../lib/index.ts",

    output: {
        file: "../dist/git-cat-file.mjs",
        format: "esm",
    },

    // Anything that ships in `dependencies` or comes from Node core is
    // resolved by the consumer at runtime — never bundle it.
    external: id => /^node:/.test(id) || ["async-cache-queue", "process.argv"].includes(id),

    plugins: [
        nodeResolve({
            preferBuiltins: true,
        }),

        sucrase({
            exclude: ["node_modules/**"],
            transforms: ["typescript"],
        }),

        showFiles(),
    ],
}

export default rollupConfig
