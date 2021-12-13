import { Firestore } from "./Firestore";
export var Query;
(function (Query) {
    function isClient(query) {
        return Firestore.isClient(query.firestore);
    }
    Query.isClient = isClient;
    function isAdmin(query) {
        return !isClient(query);
    }
    Query.isAdmin = isAdmin;
})(Query || (Query = {}));
//# sourceMappingURL=Query.js.map