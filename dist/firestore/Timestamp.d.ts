import type { firestore as admin } from "firebase-admin";
import { Timestamp as $TimestampClient } from "firebase/firestore";
export type TimestampClient = $TimestampClient;
export type TimestampAdmin = admin.Timestamp;
export type Timestamp = TimestampAdmin | TimestampClient;
export declare namespace Timestamp {
    const jsonTypeName = "firestore/Timestamp";
    function isClient(timestamp: Timestamp): timestamp is TimestampClient;
    function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin;
    function isInstance(obj: any): obj is Timestamp;
    function now(): $TimestampClient | admin.Timestamp;
    function fromDate(date: Date): $TimestampClient | admin.Timestamp;
    function fromMillis(milliseconds: number): $TimestampClient | admin.Timestamp;
}
