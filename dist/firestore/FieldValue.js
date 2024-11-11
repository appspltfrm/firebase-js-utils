import { FieldValue as $FieldValueClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var FieldValue;
(function (FieldValue) {
    function isInstance(obj) {
        return obj instanceof $FieldValueClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().FieldValue);
    }
    FieldValue.isInstance = isInstance;
    function isClient(value) {
        return value instanceof $FieldValueClient;
    }
    FieldValue.isClient = isClient;
    function isAdmin(value) {
        return !isClient(value) && (Firestore.adminInitialized() && value instanceof Firestore.admin().FieldValue);
    }
    FieldValue.isAdmin = isAdmin;
})(FieldValue || (FieldValue = {}));
//# sourceMappingURL=FieldValue.js.map