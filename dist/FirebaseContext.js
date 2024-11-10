import { buildQuery, collectionReference, documentReference } from "./firestore";
class UniversalFirebaseContext {
    projectId;
}
export class FirebaseContextClient extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return buildQuery(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return collectionReference(this.firestore, path);
    }
    firestoreDocument(path) {
        return documentReference(this.firestore, path);
    }
}
export class FirebaseContextAdmin extends UniversalFirebaseContext {
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return buildQuery(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return collectionReference(this.firestore, path);
    }
    firestoreDocument(path) {
        return documentReference(this.firestore, path);
    }
}
//# sourceMappingURL=FirebaseContext.js.map