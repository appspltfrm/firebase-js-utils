"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentReference = void 0;
const Firestore_1 = require("./Firestore");
var DocumentReference;
(function (DocumentReference) {
    function isClient(ref) {
        return Firestore_1.Firestore.isClient(ref.firestore);
    }
    DocumentReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    DocumentReference.isAdmin = isAdmin;
})(DocumentReference = exports.DocumentReference || (exports.DocumentReference = {}));
//# sourceMappingURL=DocumentReference.js.map