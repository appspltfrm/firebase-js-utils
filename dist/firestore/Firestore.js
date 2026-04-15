export var Firestore;
(function (Firestore) {
    /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Web SDK (Client).
     */
    function isClient(firestore) {
        return ["firestore-lite", "firestore"].includes(firestore.type);
    }
    Firestore.isClient = isClient;
    /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Admin SDK (Server).
     */
    function isAdmin(firestore) {
        return !isClient(firestore);
    }
    Firestore.isAdmin = isAdmin;
    let adminRef;
    /**
     * Inicjalizuje referencję do modułu firebase-admin.
     * Niezbędne dla poprawnego działania funkcji serwerowych w środowisku uniwersalnym.
     */
    function adminInit(ref) {
        adminRef = ref;
    }
    Firestore.adminInit = adminInit;
    /**
     * Sprawdza, czy moduł admina został zainicjalizowany.
     */
    function adminInitialized() {
        return !!adminRef;
    }
    Firestore.adminInitialized = adminInitialized;
    /**
     * Zwraca referencję do modułu firebase-admin lub rzuca błąd, jeśli nie został zainicjalizowany.
     */
    function admin() {
        if (!adminRef) {
            throw new Error("Admin module reference was not initialized - call setAdminRef first.");
        }
        return adminRef;
    }
    Firestore.admin = admin;
})(Firestore || (Firestore = {}));
//# sourceMappingURL=Firestore.js.map