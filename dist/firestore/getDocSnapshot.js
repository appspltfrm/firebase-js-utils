"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocSnapshotFromServer = exports.getDocSnapshotFromCache = exports.getDocSnapshot = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
function getDocSnapshot(doc) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return yield (0, firestore_1.getDoc)(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
exports.getDocSnapshot = getDocSnapshot;
function getDocSnapshotFromCache(doc) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return yield (0, firestore_1.getDocFromCache)(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
exports.getDocSnapshotFromCache = getDocSnapshotFromCache;
function getDocSnapshotFromServer(doc) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        if (DocumentReference_1.DocumentReference.isClient(doc)) {
            return yield (0, firestore_1.getDocFromServer)(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
exports.getDocSnapshotFromServer = getDocSnapshotFromServer;
//# sourceMappingURL=getDocSnapshot.js.map