import {firestore as admin} from "firebase-admin";
import * as client from "firebase/firestore";

export type FirestoreClient = client.Firestore;
export type FirestoreAdmin = admin.Firestore;
export type Firestore = FirestoreClient | FirestoreAdmin;

export namespace Firestore {

    export function isClient(firestore: Firestore): firestore is FirestoreClient {
        return ["firestore-lite", "firestore"].includes((firestore as FirestoreClient).type);
    }

    export function isAdmin(firestore: Firestore): firestore is FirestoreAdmin {
        return !isClient(firestore);
    }
}
