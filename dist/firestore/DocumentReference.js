"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentReference = exports.DocumentReference = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var DocumentReference;
(function (DocumentReference) {
    function isInstance(obj) {
        return obj instanceof firestore_1.DocumentReference || (Firestore_1.Firestore.adminInitialized() && obj instanceof Firestore_1.Firestore.admin().DocumentReference);
    }
    DocumentReference.isInstance = isInstance;
    function isClient(ref) {
        return Firestore_1.Firestore.isClient(ref.firestore);
    }
    DocumentReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    DocumentReference.isAdmin = isAdmin;
})(DocumentReference = exports.DocumentReference || (exports.DocumentReference = {}));
function documentReference(firestore, path) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.doc)(firestore, path);
    }
    else {
        return firestore.doc(path);
    }
}
exports.documentReference = documentReference;
//# sourceMappingURL=DocumentReference.js.map