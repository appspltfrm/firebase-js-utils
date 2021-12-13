import { GeoPoint as $GeoPointClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
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
    function create(firestore, latitude, longitude) {
        if (Firestore.isClient(firestore)) {
            return new $GeoPointClient(latitude, longitude);
        }
        else {
            return new (Firestore.admin().GeoPoint)(latitude, longitude);
        }
    }
    GeoPoint.create = create;
})(GeoPoint || (GeoPoint = {}));
//# sourceMappingURL=GeoPoint.js.map