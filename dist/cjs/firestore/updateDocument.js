"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocument = updateDocument;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
function updateDocument(doc, data, precondition) {
    if (DocumentReference_1.DocumentReference.isClient(doc)) {
        return (0, firestore_1.updateDoc)(doc, data);
    }
    else {
        return doc.update(data, precondition);
    }
}
//# sourceMappingURL=updateDocument.js.map