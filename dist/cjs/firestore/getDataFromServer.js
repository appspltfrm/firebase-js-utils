"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromServer = getDataFromServer;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
const Query_1 = require("./Query");
async function getDataFromServer(docOrQuery, options) {
    if (Query_1.Query.isInstance(docOrQuery)) {
        if (Query_1.Query.isClient(docOrQuery)) {
            return (await (0, firestore_1.getDocsFromServer)(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }
    }
    else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
            return (await (0, firestore_1.getDocFromServer)(docOrQuery)).data(options);
        }
        else {
            return (await docOrQuery.get()).data();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getDataFromServer.js.map