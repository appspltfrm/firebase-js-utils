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
    function now() {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.now();
        }
        else {
            return $TimestampClient.now();
        }
    }
    Timestamp.now = now;
    function fromDate(date) {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.fromDate(date);
        }
        else {
            return $TimestampClient.fromDate(date);
        }
    }
    Timestamp.fromDate = fromDate;
    function fromMillis(milliseconds) {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.fromMillis(milliseconds);
        }
        else {
            return $TimestampClient.fromMillis(milliseconds);
        }
    }
    Timestamp.fromMillis = fromMillis;
})(Timestamp || (Timestamp = {}));
//# sourceMappingURL=Timestamp.js.map