"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshotFromCache = getSnapshotFromCache;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
const Query_1 = require("./Query");
async function getSnapshotFromCache(docOrQuery) {
    if (Query_1.Query.isInstance(docOrQuery)) {
        if (Query_1.Query.isClient(docOrQuery)) {
            return await (0, firestore_1.getDocsFromCache)(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
            return await (0, firestore_1.getDocFromCache)(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getSnapshotFromCache.js.map