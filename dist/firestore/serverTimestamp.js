"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverTimestamp = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
function serverTimestamp() {
    if (Firestore_1.Firestore.adminInitialized()) {
        Firestore_1.Firestore.admin().FieldValue.serverTimestamp();
    }
    else {
        return (0, firestore_1.serverTimestamp)();
    }
}
exports.serverTimestamp = serverTimestamp;
//# sourceMappingURL=serverTimestamp.js.map