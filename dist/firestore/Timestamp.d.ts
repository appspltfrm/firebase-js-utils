import type { Timestamp as TimestampAdmin } from "firebase-admin/firestore";
import { Timestamp as TimestampClient } from "firebase/firestore";
export type { TimestampClient };
export type { TimestampAdmin };
export type Timestamp = TimestampAdmin | TimestampClient;
export declare namespace Timestamp {
    const jsonTypeName = "firestore/Timestamp";
    function isClient(timestamp: Timestamp): timestamp is TimestampClient;
    function isAdmin(timestamp: Timestamp): timestamp is TimestampAdmin;
    function isInstance(obj: any): obj is Timestamp;
    function now(): TimestampAdmin | TimestampClient;
    function fromDate(date: Date): TimestampAdmin | TimestampClient;
    function fromMillis(milliseconds: number): TimestampAdmin | TimestampClient;
}
