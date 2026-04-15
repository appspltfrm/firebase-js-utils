import type { WriteBatch as WriteBatchAdmin } from "firebase-admin/firestore";
import { WriteBatch as WriteBatchClient } from "firebase/firestore";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore.js";
export type { WriteBatchClient };
export type { WriteBatchAdmin };
export type WriteBatch = WriteBatchClient | WriteBatchAdmin;
export declare namespace WriteBatch {
    function isClient(batch: WriteBatch): batch is WriteBatchClient;
    function isAdmin(batch: WriteBatch): batch is WriteBatchAdmin;
}
export declare function writeBatch(firestore: FirestoreClient): WriteBatchClient;
export declare function writeBatch(firestore: FirestoreAdmin): WriteBatchAdmin;
export declare function writeBatch(firestore: Firestore): WriteBatch;
