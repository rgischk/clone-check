#! /usr/bin/env node

import { Command } from "commander"
import { cloneCheck } from "./clone-check"

const program = new Command()

program
    .name("clone-check")
    .argument("<sourceDir>", "The source directory")
    .argument("<cloneDir>", "The clone directory to check")
    .argument("[ignorePatterns...]", "Files and directories to ignore when checking the clone (glob syntax)")
    .option("--verbose", "Increase the console output")
    .option("-m, --message <message>", "An optional error message to show when the clone does not match the source")
    .action((sourceDir, cloneDir, ignorePatterns, options) => {
        const result = cloneCheck(sourceDir, cloneDir, options.verbose, ignorePatterns)

        if (!result.success) {
            console.log("")
            if (result.missingEntries.length > 0) {
                console.log("Missing paths:", result.missingEntries)
            }
            if (result.additionalEntries.length > 0) {
                console.log("Additional paths:", result.additionalEntries)
            }
            if (result.differentEntries.length > 0) {
                console.log("Different paths:", result.differentEntries)
            }
            console.log("")
            program.error(options.message || "Clone does not match source!")
        }
    })

program.parseAsync(process.argv)
