"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const Firestore_1 = require("./Firestore");
var Query;
(function (Query) {
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