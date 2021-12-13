"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoPoint = void 0;
const firestore_1 = require("firebase/firestore");
const Firestore_1 = require("./Firestore");
var GeoPoint;
(function (GeoPoint) {
    function isClient(gp) {
        return gp instanceof firestore_1.GeoPoint;
    }
    GeoPoint.isClient = isClient;
    function isAdmin(gp) {
        return !isClient(gp) && Firestore_1.Firestore.adminInitialized() && gp instanceof Firestore_1.Firestore.admin().GeoPoint;
    }
    GeoPoint.isAdmin = isAdmin;
    function create(firestore, latitude, longitude) {
        if (Firestore_1.Firestore.isClient(firestore)) {
            return new firestore_1.GeoPoint(latitude, longitude);
        }
        else {
            return new (Firestore_1.Firestore.admin().GeoPoint)(latitude, longitude);
        }
    }
    GeoPoint.create = create;
})(GeoPoint = exports.GeoPoint || (exports.GeoPoint = {}));
//# sourceMappingURL=GeoPoint.js.map