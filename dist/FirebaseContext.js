import { buildQuery } from "./firestore/buildQuery.js";
import { collectionReference } from "./firestore/CollectionReference.js";
import { documentReference } from "./firestore/DocumentReference.js";
import { RestQuery } from "./firestore/RestQuery.js";
export class UniversalFirebaseContext {
}
export class FirebaseContextClient extends UniversalFirebaseContext {
    firestoreRestQuery(path, ...queryConstraints) {
        return new RestQuery(this, path).apply(...queryConstraints);
    }
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