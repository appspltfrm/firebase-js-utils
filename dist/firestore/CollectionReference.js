import { collection } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var CollectionReference;
(function (CollectionReference) {
    function isClient(ref) {
        return Firestore.isClient(ref.firestore);
    }
    CollectionReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    CollectionReference.isAdmin = isAdmin;
})(CollectionReference || (CollectionReference = {}));
export function collectionReference(firestore, path) {
    if (Firestore.isClient(firestore)) {
        return collection(firestore, path);
    }
    else {
        return firestore.collection(path);
    }
}
//# sourceMappingURL=CollectionReference.js.map