import type {firestore as $admin} from "firebase-admin";
import type {Firestore as $FirestoreClient} from "firebase/firestore";

export type FirestoreClient = $FirestoreClient;
export type FirestoreAdmin = $admin.Firestore;
export type Firestore = FirestoreClient | FirestoreAdmin;

export namespace Firestore {

    export function isClient(firestore: Firestore): firestore is FirestoreClient {
        return ["firestore-lite", "firestore"].includes((firestore as FirestoreClient).type);
    }

    export function isAdmin(firestore: Firestore): firestore is FirestoreAdmin {
        return !isClient(firestore);
    }

    let adminRef: typeof $admin;

    export function adminInit(ref: typeof $admin) {
        adminRef = ref;
    }

    export function adminInitialized() {
        return !!adminRef;
    }

    export function admin(): typeof $admin {

        if (!adminRef) {
            throw new Error("Admin module reference was not initialized - call setAdminRef first.");
        }

        return adminRef;
    }
}
