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
    function isInstance(obj) {
        return obj instanceof $TimestampClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Timestamp);
    }
    Timestamp.isInstance = isInstance;
    function now(firestore) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.now();
        }
        else {
            return Firestore.admin().Timestamp.now();
        }
    }
    Timestamp.now = now;
    function fromDate(firestore, date) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.fromDate(date);
        }
        else {
            return Firestore.admin().Timestamp.fromDate(date);
        }
    }
    Timestamp.fromDate = fromDate;
    function fromMillis(firestore, milliseconds) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.fromMillis(milliseconds);
        }
        else {
            return Firestore.admin().Timestamp.fromMillis(milliseconds);
        }
    }
    Timestamp.fromMillis = fromMillis;
})(Timestamp || (Timestamp = {}));
//# sourceMappingURL=Timestamp.js.map