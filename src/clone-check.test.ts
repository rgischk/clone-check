import { cloneCheck } from "./clone-check"

describe("clone-check", () => {
    test("test complex directory structure", () => {
        const result = cloneCheck("testdata/source", "testdata/clone")

        expect(result.success).toEqual(false)
        expect(result.additionalEntries.sort()).toEqual([
            "additional-directory",
            "additional-directory/additional-file-in-additional-directory.txt",
            "additional-empty-directory",
            "additional-empty-file.txt",
            "additional-file.txt",
            "deep/additional-directory",
            "deep/additional-directory/additional-file-in-additional-directory.txt",
            "deep/additional-empty-directory",
            "deep/additional-empty-file.txt",
            "deep/additional-file.txt",
        ])
        expect(result.missingEntries.sort()).toEqual([
            "deep/missing-directory",
            "deep/missing-directory/missing-file-in-missing-directory.txt",
            "deep/missing-empty-directory",
            "deep/missing-empty-file.txt",
            "deep/missing-file.txt",
            "missing-directory",
            "missing-directory/missing-file-in-missing-directory.txt",
            "missing-empty-directory",
            "missing-empty-file.txt",
            "missing-file.txt",
        ])

        expect(result.differentEntries.sort()).toEqual([
            "deep/different-content.txt",
            "different-content.txt",
            "directory-in-source",
            "file-in-source",
        ])
    })
})
