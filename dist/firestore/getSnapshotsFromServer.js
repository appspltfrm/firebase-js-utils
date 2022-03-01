"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotsFromServer = void 0;
const tslib_1 = require("tslib");
const getSnapshotFromServer_1 = require("./getSnapshotFromServer");
function getSnapshotsFromServer(query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return (yield (0, getSnapshotFromServer_1.getSnapshotFromServer)(query)).docs;
    });
}
exports.getSnapshotsFromServer = getSnapshotsFromServer;
//# sourceMappingURL=getSnapshotsFromServer.js.map