import { Firestore } from "./Firestore";
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
//# sourceMappingURL=CollectionReference.js.map