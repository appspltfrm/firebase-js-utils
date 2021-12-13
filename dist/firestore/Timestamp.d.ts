import type { firestore as admin } from "firebase-admin";
import { Timestamp as $TimestampClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export declare type TimestampClient = $TimestampClient;
export declare type TimestampAdmin = admin.Timestamp;
export declare type Timestamp = TimestampAdmin | TimestampClient;
export declare namespace Timestamp {
    function isClient(timestamp: Timestamp): timestamp is TimestampClient;
    function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin;
    function now(firestore: Firestore): admin.Timestamp | $TimestampClient;
}
