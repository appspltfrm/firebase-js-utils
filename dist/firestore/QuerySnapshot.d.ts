import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData";
export declare type QuerySnapshotClient<T = DocumentData> = client.QuerySnapshot<T>;
export declare type QuerySnapshotAdmin<T = DocumentData> = admin.QuerySnapshot<T>;
export declare type QuerySnapshot<T = DocumentData> = QuerySnapshotAdmin<T> | QuerySnapshotClient<T>;
