"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = void 0;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
function deleteDocument(doc, precondition) {
    if (DocumentReference_1.DocumentReference.isClient(doc)) {
        return (0, firestore_1.deleteDoc)(doc);
    }
    else {
        return doc.delete(precondition);
    }
}
exports.deleteDocument = deleteDocument;
//# sourceMappingURL=deleteDocument.js.map