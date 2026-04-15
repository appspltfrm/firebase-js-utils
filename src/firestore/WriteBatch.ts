import type {WriteBatch as WriteBatchAdmin} from "firebase-admin/firestore";
import {writeBatch as writeBatchClient, WriteBatch as WriteBatchClient} from "firebase/firestore";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore.js";

export type {WriteBatchClient};
export type {WriteBatchAdmin};
export type WriteBatch = WriteBatchClient | WriteBatchAdmin;

export namespace WriteBatch {

  export function isClient(batch: WriteBatch): batch is WriteBatchClient {
    return batch instanceof WriteBatchClient;
  }

  export function isAdmin(batch: WriteBatch): batch is WriteBatchAdmin {
    return !isClient(batch);
  }
}

export function writeBatch(firestore: FirestoreClient): WriteBatchClient;

export function writeBatch(firestore: FirestoreAdmin): WriteBatchAdmin;

export function writeBatch(firestore: Firestore): WriteBatch;

export function writeBatch(firestore: Firestore): WriteBatch {
  if (Firestore.isClient(firestore)) {
    return writeBatchClient(firestore);
  } else {
    return firestore.batch();
  }
}
