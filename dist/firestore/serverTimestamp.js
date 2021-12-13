"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverTimestamp = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
function serverTimestamp(firestore) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.serverTimestamp)();
    }
    else {
        Firestore_1.Firestore.admin().FieldValue.serverTimestamp();
    }
}
exports.serverTimestamp = serverTimestamp;
//# sourceMappingURL=serverTimestamp.js.map