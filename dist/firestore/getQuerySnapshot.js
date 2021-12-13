"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuerySnapshotFromServer = exports.getQuerySnapshotFromCache = exports.getQuerySnapshot = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const Query_1 = require("./Query");
function getQuerySnapshot(query) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return yield (0, firestore_1.getDocs)(query);
        }
        else {
            return yield query.get();
        }
    });
}
exports.getQuerySnapshot = getQuerySnapshot;
function getQuerySnapshotFromCache(query) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return yield (0, firestore_1.getDocsFromCache)(query);
        }
        else {
            return yield query.get();
        }
    });
}
exports.getQuerySnapshotFromCache = getQuerySnapshotFromCache;
function getQuerySnapshotFromServer(query) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (Query_1.Query.isClient(query)) {
            return yield (0, firestore_1.getDocsFromServer)(query);
        }
        else {
            return yield query.get();
        }
    });
}
exports.getQuerySnapshotFromServer = getQuerySnapshotFromServer;
//# sourceMappingURL=getQuerySnapshot.js.map