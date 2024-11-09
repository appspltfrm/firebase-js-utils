"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotsFromCache = getSnapshotsFromCache;
const getSnapshotFromCache_1 = require("./getSnapshotFromCache");
async function getSnapshotsFromCache(query) {
    return (await (0, getSnapshotFromCache_1.getSnapshotFromCache)(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromCache.js.map