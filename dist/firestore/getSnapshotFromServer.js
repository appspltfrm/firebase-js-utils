"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotFromServer = void 0;
const tslib_1 = require("tslib");
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
const Query_1 = require("./Query");
function getSnapshotFromServer(docOrQuery) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (Query_1.Query.isInstance(docOrQuery)) {
            if (Query_1.Query.isClient(docOrQuery)) {
                return yield (0, firestore_1.getDocsFromServer)(docOrQuery);
            }
            else {
                return yield docOrQuery.get();
            }
        }
        else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
                return yield (0, firestore_1.getDocFromServer)(docOrQuery);
            }
            else {
                return yield docOrQuery.get();
            }
        }
        else {
            throw new Error("Invalid DocumentReference or Query object");
        }
    });
}
exports.getSnapshotFromServer = getSnapshotFromServer;
//# sourceMappingURL=getSnapshotFromServer.js.map