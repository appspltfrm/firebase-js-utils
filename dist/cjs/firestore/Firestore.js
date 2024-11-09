"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Firestore = void 0;
var Firestore;
(function (Firestore) {
    function isClient(firestore) {
        return ["firestore-lite", "firestore"].includes(firestore.type);
    }
    Firestore.isClient = isClient;
    function isAdmin(firestore) {
        return !isClient(firestore);
    }
    Firestore.isAdmin = isAdmin;
    let adminRef;
    function adminInit(ref) {
        adminRef = ref;
    }
    Firestore.adminInit = adminInit;
    function adminInitialized() {
        return !!adminRef;
    }
    Firestore.adminInitialized = adminInitialized;
    function admin() {
        if (!adminRef) {
            throw new Error("Admin module reference was not initialized - call setAdminRef first.");
        }
        return adminRef;
    }
    Firestore.admin = admin;
})(Firestore || (exports.Firestore = Firestore = {}));
//# sourceMappingURL=Firestore.js.map