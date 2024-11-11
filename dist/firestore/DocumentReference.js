import { doc, DocumentReference as $DocumentReferenceClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var DocumentReference;
(function (DocumentReference) {
    function isInstance(obj) {
        return obj instanceof $DocumentReferenceClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().DocumentReference);
    }
    DocumentReference.isInstance = isInstance;
    function isClient(ref) {
        return Firestore.isClient(ref.firestore);
    }
    DocumentReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    DocumentReference.isAdmin = isAdmin;
})(DocumentReference || (DocumentReference = {}));
export function documentReference(firestore, path) {
    if (Firestore.isClient(firestore)) {
        return doc(firestore, path);
    }
    else {
        return firestore.doc(path);
    }
}
//# sourceMappingURL=DocumentReference.js.map