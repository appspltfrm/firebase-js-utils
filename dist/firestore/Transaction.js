"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const firestore_1 = require("firebase/firestore");
var Transaction;
(function (Transaction) {
    function isClient(transaction) {
        return transaction instanceof firestore_1.Transaction;
    }
    Transaction.isClient = isClient;
    function isAdmin(transaction) {
        return !isClient(transaction);
    }
    Transaction.isAdmin = isAdmin;
})(Transaction = exports.Transaction || (exports.Transaction = {}));
//# sourceMappingURL=Transaction.js.map