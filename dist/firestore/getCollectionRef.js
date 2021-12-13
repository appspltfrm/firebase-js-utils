"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionRef = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
function getCollectionRef(firestore, path) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.collection)(firestore, path);
    }
    else {
        return firestore.collection(path);
    }
}
exports.getCollectionRef = getCollectionRef;
//# sourceMappingURL=getCollectionRef.js.map