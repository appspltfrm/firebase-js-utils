import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData";
export declare type DocumentSnapshotClient<T = DocumentData> = client.DocumentSnapshot<T>;
export declare type DocumentSnapshotAdmin<T = DocumentData> = admin.DocumentSnapshot<T>;
export declare type DocumentSnapshot<T = DocumentData> = DocumentSnapshotAdmin<T> | DocumentSnapshotClient<T>;
