import { Firestore } from "./Firestore";
export var DocumentReference;
(function (DocumentReference) {
    function isClient(ref) {
        return Firestore.isClient(ref.firestore);
    }
    DocumentReference.isClient = isClient;
    function isAdmin(ref) {
        return !isClient(ref);
    }
    DocumentReference.isAdmin = isAdmin;
})(DocumentReference || (DocumentReference = {}));
//# sourceMappingURL=DocumentReference.js.map