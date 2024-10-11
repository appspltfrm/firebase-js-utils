import type { firestore as admin } from "firebase-admin";
import { Timestamp as $TimestampClient } from "firebase/firestore";
export type TimestampClient = $TimestampClient;
export type TimestampAdmin = admin.Timestamp;
export type Timestamp = TimestampAdmin | TimestampClient;
export declare namespace Timestamp {
    function isClient(timestamp: Timestamp): timestamp is TimestampClient;
    function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin;
    function isInstance(obj: any): obj is Timestamp;
    function now(): admin.Timestamp | $TimestampClient;
    function fromDate(date: Date): admin.Timestamp | $TimestampClient;
    function fromMillis(milliseconds: number): admin.Timestamp | $TimestampClient;
}
