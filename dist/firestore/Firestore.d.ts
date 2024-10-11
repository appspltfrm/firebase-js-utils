import type { firestore as $admin } from "firebase-admin";
import type { Firestore as $FirestoreClient } from "firebase/firestore";
export type FirestoreClient = $FirestoreClient;
export type FirestoreAdmin = $admin.Firestore;
export type Firestore = FirestoreClient | FirestoreAdmin;
export declare namespace Firestore {
    function isClient(firestore: Firestore): firestore is FirestoreClient;
    function isAdmin(firestore: Firestore): firestore is FirestoreAdmin;
    function adminInit(ref: typeof $admin): void;
    function adminInitialized(): boolean;
    function admin(): typeof $admin;
}
