"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValue = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var FieldValue;
(function (FieldValue) {
    function isInstance(obj) {
        return obj instanceof firestore_1.FieldValue || (Firestore_1.Firestore.adminInitialized() && obj instanceof Firestore_1.Firestore.admin().FieldValue);
    }
    FieldValue.isInstance = isInstance;
    function isClient(value) {
        return value instanceof firestore_1.FieldValue;
    }
    FieldValue.isClient = isClient;
    function isAdmin(value) {
        return !isClient(value) && (Firestore_1.Firestore.adminInitialized() && value instanceof Firestore_1.Firestore.admin().FieldValue);
    }
    FieldValue.isAdmin = isAdmin;
})(FieldValue = exports.FieldValue || (exports.FieldValue = {}));
//# sourceMappingURL=FieldValue.js.map