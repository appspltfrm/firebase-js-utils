import type {firestore as admin} from "firebase-admin";
import type * as client from "firebase/firestore";
import {writeBatch as writeBatchClient} from "firebase/firestore";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export type WriteBatchClient = client.WriteBatch;
export type WriteBatchAdmin = admin.WriteBatch;
export type WriteBatch = WriteBatchClient | WriteBatchAdmin;

export namespace WriteBatch {

    export function isClient(firestore: Firestore, batch: WriteBatch): batch is WriteBatchClient {
        return Firestore.isClient(firestore);
    }

    export function isAdmin(firestore: Firestore, batch: WriteBatch): batch is WriteBatchAdmin {
        return !isClient(firestore, batch);
    }
}

export function writeBatch(firestore: FirestoreClient): WriteBatchClient;

export function writeBatch(firestore: FirestoreAdmin): WriteBatchAdmin;

export function writeBatch(firestore: Firestore): WriteBatch;

export function writeBatch(firestore: Firestore): WriteBatch {
    if (Firestore.isClient(firestore)) {
        return writeBatchClient(firestore);
    } else {
        firestore.batch();
    }
}
