"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTransaction = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
function runTransaction(firestore, updateFunction) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.runTransaction)(firestore, updateFunction);
    }
    else {
        return firestore.runTransaction(updateFunction);
    }
}
exports.runTransaction = runTransaction;
//# sourceMappingURL=runTransaction.js.map