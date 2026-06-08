import { getFunctions, httpsCallableFromURL } from "firebase/functions";
import { buildQuery } from "./firestore/buildQuery.js";
import { collectionReference } from "./firestore/CollectionReference.js";
import { documentReference } from "./firestore/DocumentReference.js";
import { restCollectionQuery } from "./firestore/rest.js";
import { serialize } from "./functions/serialize.js";
import { unserialize } from "./functions/unserialize.js";
/**
 * Abstrakcyjna klasa bazowa dla kontekstu Firebase, ujednolicająca dostęp do Firestore w różnych środowiskach.
 * Pozwala na pisanie kodu uniwersalnego, który może działać zarówno po stronie klienta (Web SDK), jak i serwera (Admin SDK).
 *
 * @category Context
 */
export class UniversalFirebaseContext {
    isFirestoreEmulator() {
        return false;
    }
}
/**
 * Implementacja kontekstu Firebase przeznaczona dla środowiska klienta (Web SDK).
 *
 * @category Context
 */
export class FirebaseContextClient extends UniversalFirebaseContext {
    async functionCall(name, data) {
        const func = httpsCallableFromURL(getFunctions(this.firebase), this.functionUrl(name));
        if (typeof data === "object") {
            data = serialize(data);
        }
        const resp = await func(data);
        if (typeof resp.data === "object") {
            return unserialize(resp.data);
        }
        return resp.data;
    }
    /**
       * Specyficzne dla klienta zapytanie REST (np. dla optymalizacji lub omijania ograniczeń SDK).
       */
    firestoreRestQuery(path, ...queryConstraints) {
        return restCollectionQuery(this.firestore(), path).apply(...queryConstraints);
    }
    firestoreQuery(pathOrCollection, ...queryConstraints) {
        const collection = typeof pathOrCollection === "string" ? this.firestoreCollection(pathOrCollection) : pathOrCollection;
        return buildQuery(collection, ...queryConstraints);
    }
    firestoreCollection(path) {
        return collectionReference(this.firestore(), path);
    }
    firestoreDocument(path) {
        return documentReference(this.firestore(), path);
    }
    firestorePipeline(collectionOrQuery) {
        return this.firestore().pipeline().collection(typeof collectionOrQuery === "string" ? collectionReference(this.firestore(), collectionOrQuery) : collectionOrQuery);
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
        return collectionReference(this.firestore(), path);
    }
    firestoreDocument(path) {
        return documentReference(this.firestore(), path);
    }
    firestorePipeline(collectionOrQuery) {
        const pipeline = this.firestore("enterprise").pipeline();
        if (typeof collectionOrQuery === "string") {
            return pipeline.collection(this.firestoreCollection(collectionOrQuery));
        }
        else if (collectionOrQuery.path) {
            return pipeline.collection(collectionOrQuery);
        }
        else {
            return pipeline.createFrom(collectionOrQuery);
        }
    }
}
//# sourceMappingURL=FirebaseContext.js.map