"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDocument = setDocument;
const firestore_1 = require("firebase/firestore");
const DocumentReference_1 = require("./DocumentReference");
function setDocument(doc, data, options) {
    if (DocumentReference_1.DocumentReference.isClient(doc)) {
        return (0, firestore_1.setDoc)(doc, data, options);
    }
    else {
        return doc.set(data, options);
    }
}
//# sourceMappingURL=setDocument.js.map