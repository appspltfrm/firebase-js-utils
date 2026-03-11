import type { firestore as $admin } from "firebase-admin";
import type { Firestore as $FirestoreClient } from "firebase/firestore";
export type FirestoreClient = $FirestoreClient;
export type FirestoreAdmin = $admin.Firestore;
/**
 * Polimorficzny typ Firestore, reprezentujący albo Web SDK, albo Admin SDK.
 */
export type Firestore = FirestoreClient | FirestoreAdmin;
export declare namespace Firestore {
    /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Web SDK (Client).
     */
    function isClient(firestore: Firestore): firestore is FirestoreClient;
    /**
     * Sprawdza, czy przekazana instancja Firestore pochodzi z Admin SDK (Server).
     */
    function isAdmin(firestore: Firestore): firestore is FirestoreAdmin;
    /**
     * Inicjalizuje referencję do modułu firebase-admin.
     * Niezbędne dla poprawnego działania funkcji serwerowych w środowisku uniwersalnym.
     */
    function adminInit(ref: typeof $admin): void;
    /**
     * Sprawdza, czy moduł admina został zainicjalizowany.
     */
    function adminInitialized(): boolean;
    /**
     * Zwraca referencję do modułu firebase-admin lub rzuca błąd, jeśli nie został zainicjalizowany.
     */
    function admin(): typeof $admin;
}
