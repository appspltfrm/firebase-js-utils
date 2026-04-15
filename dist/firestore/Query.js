import { Query as QueryClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var Query;
(function (Query) {
    /**
       * Sprawdza, czy obiekt jest instancją zapytania Firestore (klienta lub admina).
       */
    function isInstance(obj) {
        return obj instanceof QueryClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Query);
    }
    Query.isInstance = isInstance;
    /**
       * Sprawdza, czy zapytanie pochodzi z Web SDK.
       */
    function isClient(query) {
        return Firestore.isClient(query.firestore);
    }
    Query.isClient = isClient;
    /**
       * Sprawdza, czy zapytanie pochodzi z Admin SDK.
       */
    function isAdmin(query) {
        return !isClient(query);
    }
    Query.isAdmin = isAdmin;
})(Query || (Query = {}));
//# sourceMappingURL=Query.js.map