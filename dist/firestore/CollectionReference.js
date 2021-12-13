"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionReference = void 0;
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
//# sourceMappingURL=CollectionReference.js.map