import { buildQuery } from "./firestore/buildQuery.js";
import { collectionReference } from "./firestore/CollectionReference.js";
import { documentReference } from "./firestore/DocumentReference.js";
import { RestQuery } from "./firestore/rest.js";
/**
 * Abstrakcyjna klasa bazowa dla kontekstu Firebase, ujednolicająca dostęp do Firestore w różnych środowiskach.
 * Pozwala na pisanie kodu uniwersalnego, który może działać zarówno po stronie klienta (Web SDK), jak i serwera (Admin SDK).
 *
 * @category Context
 */
export class UniversalFirebaseContext {
}
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska klienta (Web SDK).
 *
 * @category Context
 */
export class FirebaseContextClient extends UniversalFirebaseContext {
    /**
       * Specyficzne dla klienta zapytanie REST (np. dla optymalizacji lub omijania ograniczeń SDK).
       */
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
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska serwera (Admin SDK).
 *
 * @category Context
 */
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