import glob from "glob"
import md5File from "md5-file"
import path from "path"
import fs from "fs"

export type Result = {
    success: boolean
    missingEntries: string[]
    cloneEntries: string[]
    differentContent: string[]
}

export function cloneCheck(sourceDirectory: string, cloneDirectory: string, verbose?: boolean, ignorePatterns?: string[]): Result {
    if (verbose) {
        console.log("")
        console.log("Arguments:", { sourceDirectory, cloneDirectory, ignorePatterns, verbose })
    }

    const sourceEntries = glob.sync("**/*", {cwd: sourceDirectory, ignore: ignorePatterns})
    const cloneEntries = glob.sync("**/*", {cwd: cloneDirectory, ignore: ignorePatterns})
    if (verbose) {
        console.log("Entries to check:", {sourceEntries, cloneEntries})
    }

    const missingEntries = []
    const differentContent = []

    for (const sourceEntry of sourceEntries) {
        const indexOfCloneEntry = cloneEntries.indexOf(sourceEntry)
        if (indexOfCloneEntry < 0) {
            if (verbose) {
                console.log("Entry missing in clone:", sourceEntry)
            }
            missingEntries.push(sourceEntry)
        } else {
            if (!checkEntry(sourceDirectory, cloneDirectory, sourceEntry, verbose)) {
                differentContent.push(sourceEntry)
            }
            cloneEntries.splice(indexOfCloneEntry, 1)
        }
    }

    if (verbose) {
        console.log("Results:", {sourceEntries, cloneEntries, missingEntries, differentContent})
    }

    return {
        success: missingEntries.length === 0 && cloneEntries.length === 0 && differentContent.length === 0,
        missingEntries,
        cloneEntries,
        differentContent
    }
}

function checkEntry(sourceDirectory: string, cloneDirectory: string, entry: string, verbose?: boolean): boolean {
    const sourceEntry = path.join(sourceDirectory, entry)
    const cloneEntry = path.join(cloneDirectory, entry)
    const sourceIsFile = fs.statSync(sourceEntry).isFile()
    const cloneIsFile = fs.statSync(cloneEntry).isFile()
    if (sourceIsFile && cloneIsFile) {
        const sourceHash = md5File.sync(sourceEntry)
        const cloneHash = md5File.sync(cloneEntry)
        if (verbose) {
            console.log(`Path: ${sourceEntry} - ${sourceHash === cloneHash ? "SAME" : "DIFFERENT"}`)
            console.log(`    Source: ${sourceHash} (MD5)`)
            console.log(`    Clone:  ${cloneHash} (MD5)`)
        }
        return sourceHash === cloneHash
    } else if (sourceIsFile || cloneIsFile) {
        if (verbose) {
            console.log(`Path: ${sourceEntry} - DIFFERENT`)
            console.log(`    Source is ${sourceIsFile ? "file" : "directory"}`)
            console.log(`    Clone is ${cloneIsFile ? "file" : "directory"}`)
        }
        return false
    }
    if (verbose) {
        console.log(`Path: ${sourceEntry} - SAME`)
        console.log("    Both are directories")
    }
    return true
}