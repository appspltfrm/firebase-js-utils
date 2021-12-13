import { getCollectionRef, getDocRef, getQuery } from "./firestore";
class UniversalFirebaseContext {
}
export class FirebaseContextClient extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return getQuery(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return getCollectionRef(this.firestore, path);
    }
    firestoreDoc(path) {
        return getDocRef(this.firestore, path);
    }
}
export class FirebaseContextAdmin extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return getQuery(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return getCollectionRef(this.firestore, path);
    }
    firestoreDoc(path) {
        return getDocRef(this.firestore, path);
    }
}
//# sourceMappingURL=FirebaseContext.js.map