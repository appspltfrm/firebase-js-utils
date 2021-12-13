"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocRef = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
function getDocRef(firestore, path) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.doc)(firestore, path);
    }
    else {
        return firestore.doc(path);
    }
}
exports.getDocRef = getDocRef;
//# sourceMappingURL=getDocRef.js.map