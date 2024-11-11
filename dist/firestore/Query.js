import { Query as $QueryClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var Query;
(function (Query) {
    function isInstance(obj) {
        return obj instanceof $QueryClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Query);
    }
    Query.isInstance = isInstance;
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