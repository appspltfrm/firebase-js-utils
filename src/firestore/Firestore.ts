import type {firestore as $admin} from "firebase-admin";
import type {Firestore as $FirestoreClient} from "firebase/firestore";

export type FirestoreClient = $FirestoreClient;
export type FirestoreAdmin = $admin.Firestore;

/**
 * Polimorficzny typ Firestore, reprezentujący albo Web SDK, albo Admin SDK.
 */
export type Firestore = FirestoreClient | FirestoreAdmin;

export namespace Firestore {

  /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Web SDK (Client).
     */
  export function isClient(firestore: Firestore): firestore is FirestoreClient {
    return ["firestore-lite", "firestore"].includes((firestore as FirestoreClient).type);
  }

  /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Admin SDK (Server).
     */
  export function isAdmin(firestore: Firestore): firestore is FirestoreAdmin {
    return !isClient(firestore);
  }

  let adminRef: typeof $admin;

  /**
     * Inicjalizuje referencję do modułu firebase-admin.
     * Niezbędne dla poprawnego działania funkcji serwerowych w środowisku uniwersalnym.
     */
  export function adminInit(ref: typeof $admin) {
    adminRef = ref;
  }

  /**
     * Sprawdza, czy moduł admina został zainicjalizowany.
     */
  export function adminInitialized() {
    return !!adminRef;
  }

  /**
     * Zwraca referencję do modułu firebase-admin lub rzuca błąd, jeśli nie został zainicjalizowany.
     */
  export function admin(): typeof $admin {

    if (!adminRef) {
      throw new Error("Admin module reference was not initialized - call setAdminRef first.");
    }

    return adminRef;
  }
}
