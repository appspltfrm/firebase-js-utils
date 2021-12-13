import { writeBatch as writeBatchClient, WriteBatch as $WriteBatchClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export var WriteBatch;
(function (WriteBatch) {
    function isClient(batch) {
        return batch instanceof $WriteBatchClient;
    }
    WriteBatch.isClient = isClient;
    function isAdmin(batch) {
        return !isClient(batch);
    }
    WriteBatch.isAdmin = isAdmin;
})(WriteBatch || (WriteBatch = {}));
export function writeBatch(firestore) {
    if (Firestore.isClient(firestore)) {
        return writeBatchClient(firestore);
    }
    else {
        firestore.batch();
    }
}
//# sourceMappingURL=WriteBatch.js.map