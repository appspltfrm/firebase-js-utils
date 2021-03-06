"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBatch = exports.WriteBatch = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var WriteBatch;
(function (WriteBatch) {
    function isClient(batch) {
        return batch instanceof firestore_1.WriteBatch;
    }
    WriteBatch.isClient = isClient;
    function isAdmin(batch) {
        return !isClient(batch);
    }
    WriteBatch.isAdmin = isAdmin;
})(WriteBatch = exports.WriteBatch || (exports.WriteBatch = {}));
function writeBatch(firestore) {
    if (Firestore_1.Firestore.isClient(firestore)) {
        return (0, firestore_1.writeBatch)(firestore);
    }
    else {
        return firestore.batch();
    }
}
exports.writeBatch = writeBatch;
//# sourceMappingURL=WriteBatch.js.map