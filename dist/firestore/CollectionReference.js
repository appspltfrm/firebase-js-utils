"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionReference = exports.CollectionReference = void 0;
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
})(CollectionReference = exports.CollectionReference || (exports.CollectionReference = {}));
function collectionReference(firestore, path) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.collection)(firestore, path);
    }
    else {
        return firestore.collection(path);
    }
}
exports.collectionReference = collectionReference;
//# sourceMappingURL=CollectionReference.js.map