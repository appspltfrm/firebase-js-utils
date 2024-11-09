"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnapshot = getSnapshot;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
const Query_1 = require("./Query");
async function getSnapshot(docOrQuery) {
    if (Query_1.Query.isInstance(docOrQuery)) {
        if (Query_1.Query.isClient(docOrQuery)) {
            return await (0, firestore_1.getDocs)(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
            return await (0, firestore_1.getDoc)(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getSnapshot.js.map