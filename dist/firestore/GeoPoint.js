import { GeoPoint as $GeoPointClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export var GeoPoint;
(function (GeoPoint) {
    function isClient(gp) {
        return gp instanceof $GeoPointClient;
    }
    GeoPoint.isClient = isClient;
    function isAdmin(gp) {
        return !isClient(gp) && Firestore.adminInitialized() && gp instanceof Firestore.admin().GeoPoint;
    }
    GeoPoint.isAdmin = isAdmin;
    function isInstance(obj) {
        return isClient(obj) || isAdmin(obj);
    }
    GeoPoint.isInstance = isInstance;
    function create(latitude, longitude) {
        if (Firestore.adminInitialized()) {
            return new (Firestore.admin().GeoPoint)(latitude, longitude);
        }
        else {
            return new $GeoPointClient(latitude, longitude);
        }
    }
    GeoPoint.create = create;
})(GeoPoint || (GeoPoint = {}));
//# sourceMappingURL=GeoPoint.js.map