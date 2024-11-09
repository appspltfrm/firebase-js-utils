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
    function isInstance(obj) {
        return isClient(obj) || isAdmin(obj);
    }
    GeoPoint.isInstance = isInstance;
    function create(latitude, longitude) {
        if (Firestore_1.Firestore.adminInitialized()) {
            return new (Firestore_1.Firestore.admin().GeoPoint)(latitude, longitude);
        }
        else {
            return new firestore_1.GeoPoint(latitude, longitude);
        }
    }
    GeoPoint.create = create;
})(GeoPoint || (exports.GeoPoint = GeoPoint = {}));
//# sourceMappingURL=GeoPoint.js.map