import { Transaction as TransactionClient } from "firebase/firestore";
export var Transaction;
(function (Transaction) {
    function isClient(transaction) {
        return transaction instanceof TransactionClient;
    }
    Transaction.isClient = isClient;
    function isAdmin(transaction) {
        return !isClient(transaction);
    }
    Transaction.isAdmin = isAdmin;
})(Transaction || (Transaction = {}));
//# sourceMappingURL=Transaction.js.map