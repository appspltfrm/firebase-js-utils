"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotsFromCache = void 0;
const tslib_1 = require("tslib");
const getSnapshotFromCache_1 = require("./getSnapshotFromCache");
function getSnapshotsFromCache(query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield (0, getSnapshotFromCache_1.getSnapshotFromCache)(query)).docs;
    });
}
exports.getSnapshotsFromCache = getSnapshotsFromCache;
//# sourceMappingURL=getSnapshotsFromCache.js.map