"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var Query;
(function (Query) {
    function isInstance(obj) {
        return obj instanceof firestore_1.Query || (Firestore_1.Firestore.adminInitialized() && obj instanceof Firestore_1.Firestore.admin().Query);
    }
    Query.isInstance = isInstance;
    function isClient(query) {
        return Firestore_1.Firestore.isClient(query.firestore);
    }
    Query.isClient = isClient;
    function isAdmin(query) {
        return !isClient(query);
    }
    Query.isAdmin = isAdmin;
})(Query = exports.Query || (exports.Query = {}));
//# sourceMappingURL=Query.js.map