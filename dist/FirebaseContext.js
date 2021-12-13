"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseContextAdmin = exports.FirebaseContextClient = void 0;
const firestore_1 = require("./firestore");
class UniversalFirebaseContext {
}
class FirebaseContextClient extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return (0, firestore_1.getQuery)(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return (0, firestore_1.getCollectionRef)(this.firestore, path);
    }
    firestoreDoc(path) {
        return (0, firestore_1.getDocRef)(this.firestore, path);
    }
}
exports.FirebaseContextClient = FirebaseContextClient;
class FirebaseContextAdmin extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return (0, firestore_1.getQuery)(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return (0, firestore_1.getCollectionRef)(this.firestore, path);
    }
    firestoreDoc(path) {
        return (0, firestore_1.getDocRef)(this.firestore, path);
    }
}
exports.FirebaseContextAdmin = FirebaseContextAdmin;
//# sourceMappingURL=FirebaseContext.js.map