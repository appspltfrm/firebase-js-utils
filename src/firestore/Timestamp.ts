import type {firestore as admin} from "firebase-admin";
import {Timestamp as $TimestampClient} from "firebase/firestore";
import {Firestore} from "./Firestore";

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

    export function now(firestore: Firestore) {
        if (Firestore.isClient(firestore)) {
            return $TimestampClient.now();
        } else {
            return Firestore.admin().Timestamp.now();
        }
    }
}
