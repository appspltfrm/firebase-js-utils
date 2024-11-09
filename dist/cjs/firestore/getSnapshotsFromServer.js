"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotsFromServer = getSnapshotsFromServer;
const getSnapshotFromServer_1 = require("./getSnapshotFromServer");
async function getSnapshotsFromServer(query) {
    return (await (0, getSnapshotFromServer_1.getSnapshotFromServer)(query)).docs;
}
//# sourceMappingURL=getSnapshotsFromServer.js.map