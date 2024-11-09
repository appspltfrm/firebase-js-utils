"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionReference = void 0;
exports.collectionReference = collectionReference;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var CollectionReference;
(function (CollectionReference) {
    function isClient(ref) {
        return Firestore_1.Firestore.isClient(ref.firestore);
    }
    CollectionReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    CollectionReference.isAdmin = isAdmin;
})(CollectionReference || (exports.CollectionReference = CollectionReference = {}));
function collectionReference(firestore, path) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.collection)(firestore, path);
    }
    else {
        return firestore.collection(path);
    }
}
//# sourceMappingURL=CollectionReference.js.map