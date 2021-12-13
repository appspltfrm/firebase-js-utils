import type {firestore as admin} from "firebase-admin";
import {Timestamp as $TimestampClient} from "firebase/firestore";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export type TimestampClient = $TimestampClient;
export type TimestampAdmin = admin.Timestamp;

export type Timestamp = TimestampAdmin | TimestampClient;

export namespace Timestamp {

    export function isClient(timestamp: Timestamp): timestamp is TimestampClient {
        return timestamp instanceof $TimestampClient;
    }

    export function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin {
        return !isClient(timestamp);
    }

    export function isInstance(obj: any): obj is Timestamp {
        return obj instanceof $TimestampClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Timestamp);
    }


    export function now(firestore: FirestoreClient): TimestampClient;

    export function now(firestore: FirestoreAdmin): TimestampAdmin;

    export function now(firestore: Firestore): Timestamp;

    export function now(firestore: Firestore) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.now();
        } else {
            return Firestore.admin().Timestamp.now();
        }
    }

    export function fromDate(firestore: FirestoreClient, date: Date): TimestampClient;

    export function fromDate(firestore: FirestoreAdmin, date: Date): TimestampAdmin;

    export function fromDate(firestore: Firestore, date: Date): Timestamp;

    export function fromDate(firestore: Firestore, date: Date) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.fromDate(date);
        } else {
            return Firestore.admin().Timestamp.fromDate(date);
        }
    }

    export function fromMillis(firestore: FirestoreClient, milliseconds: number): TimestampClient;

    export function fromMillis(firestore: FirestoreAdmin, milliseconds: number): TimestampAdmin;

    export function fromMillis(firestore: Firestore, milliseconds: number): Timestamp;

    export function fromMillis(firestore: Firestore, milliseconds: number) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.fromMillis(milliseconds);
        } else {
            return Firestore.admin().Timestamp.fromMillis(milliseconds);
        }
    }
}
