import { FieldPath as $FieldPathClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var FieldPath;
(function (FieldPath) {
    function isInstance(obj) {
        return obj instanceof $FieldPathClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().FieldPath);
    }
    FieldPath.isInstance = isInstance;
    function isClient(value) {
        return value instanceof $FieldPathClient;
    }
    FieldPath.isClient = isClient;
    function isAdmin(value) {
        return !isClient(value) && (Firestore.adminInitialized() && value instanceof Firestore.admin().FieldPath);
    }
    FieldPath.isAdmin = isAdmin;
    function create(...fieldNames) {
        if (Firestore.adminInitialized()) {
            return new (Firestore.admin().FieldPath)(...fieldNames);
        }
        else {
            return new $FieldPathClient(...fieldNames);
        }
    }
    FieldPath.create = create;
})(FieldPath || (FieldPath = {}));
//# sourceMappingURL=FieldPath.js.map