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
    function now(firestore) {
        if (Firestore_1.Firestore.isClient(firestore)) {
            return firestore_1.Timestamp.now();
        }
        else {
            return Firestore_1.Firestore.admin().Timestamp.now();
        }
    }
    Timestamp.now = now;
})(Timestamp = exports.Timestamp || (exports.Timestamp = {}));
//# sourceMappingURL=Timestamp.js.map