import { Timestamp as $TimestampClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export var Timestamp;
(function (Timestamp) {
    function isClient(timestamp) {
        return timestamp instanceof $TimestampClient;
    }
    Timestamp.isClient = isClient;
    function isAdmin(timestamp) {
        return !isClient(timestamp);
    }
    Timestamp.isAdmin = isAdmin;
    function now(firestore) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.now();
        }
        else {
            return Firestore.admin().Timestamp.now();
        }
    }
    Timestamp.now = now;
})(Timestamp || (Timestamp = {}));
//# sourceMappingURL=Timestamp.js.map