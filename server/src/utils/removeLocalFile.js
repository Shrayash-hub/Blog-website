import fs from "fs";

// Removes a locally stored file from disk. Safe to call even if the file
// path is empty or the file is already missing - used whenever a stored
// file (post image, avatar, standalone upload) is replaced or its parent
// record is deleted, so orphaned uploads don't pile up on disk.
export const removeLocalFile = (filePath) => {
    if (!filePath) return;
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Failed to remove file:", filePath, err.message);
        }
    });
};
