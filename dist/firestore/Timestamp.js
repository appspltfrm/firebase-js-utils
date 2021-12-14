"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var Timestamp;
(function (Timestamp) {
    function isClient(timestamp) {
        return timestamp instanceof firestore_1.Timestamp;
    }
    Timestamp.isClient = isClient;
    function isAdmin(timestamp) {
        return !isClient(timestamp);
    }
    Timestamp.isAdmin = isAdmin;
    function isInstance(obj) {
        return obj instanceof firestore_1.Timestamp || (Firestore_1.Firestore.adminInitialized() && obj instanceof Firestore_1.Firestore.admin().Timestamp);
    }
    Timestamp.isInstance = isInstance;
    function now() {
        if (Firestore_1.Firestore.adminInitialized()) {
            return Firestore_1.Firestore.admin().Timestamp.now();
        }
        else {
            return firestore_1.Timestamp.now();
        }
    }
    Timestamp.now = now;
    function fromDate(date) {
        if (Firestore_1.Firestore.adminInitialized()) {
            return Firestore_1.Firestore.admin().Timestamp.fromDate(date);
        }
        else {
            return firestore_1.Timestamp.fromDate(date);
        }
    }
    Timestamp.fromDate = fromDate;
    function fromMillis(milliseconds) {
        if (Firestore_1.Firestore.adminInitialized()) {
            return Firestore_1.Firestore.admin().Timestamp.fromMillis(milliseconds);
        }
        else {
            return firestore_1.Timestamp.fromMillis(milliseconds);
        }
    }
    Timestamp.fromMillis = fromMillis;
})(Timestamp = exports.Timestamp || (exports.Timestamp = {}));
//# sourceMappingURL=Timestamp.js.map