import type { firestore as admin } from "firebase-admin";
import { Timestamp as $TimestampClient } from "firebase/firestore";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export declare type TimestampClient = $TimestampClient;
export declare type TimestampAdmin = admin.Timestamp;
export declare type Timestamp = TimestampAdmin | TimestampClient;
export declare namespace Timestamp {
    function isClient(timestamp: Timestamp): timestamp is TimestampClient;
    function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin;
    function isInstance(obj: any): obj is Timestamp;
    function now(firestore: FirestoreClient): TimestampClient;
    function now(firestore: FirestoreAdmin): TimestampAdmin;
    function now(firestore: Firestore): Timestamp;
    function fromDate(firestore: FirestoreClient, date: Date): TimestampClient;
    function fromDate(firestore: FirestoreAdmin, date: Date): TimestampAdmin;
    function fromDate(firestore: Firestore, date: Date): Timestamp;
    function fromMillis(firestore: FirestoreClient, milliseconds: number): TimestampClient;
    function fromMillis(firestore: FirestoreAdmin, milliseconds: number): TimestampAdmin;
    function fromMillis(firestore: Firestore, milliseconds: number): Timestamp;
}
