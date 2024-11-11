import type {firestore as admin} from "firebase-admin";
import {Timestamp as $TimestampClient} from "firebase/firestore";
import {Firestore} from "./Firestore.js";

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


    export function now() {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.now();
        } else {
            return $TimestampClient.now();
        }
    }

    export function fromDate(date: Date) {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.fromDate(date);
        } else {
            return $TimestampClient.fromDate(date);
        }
    }

    export function fromMillis(milliseconds: number) {
        if (Firestore.adminInitialized()) {
            return Firestore.admin().Timestamp.fromMillis(milliseconds);
        } else {
            return $TimestampClient.fromMillis(milliseconds);
        }
    }
}
