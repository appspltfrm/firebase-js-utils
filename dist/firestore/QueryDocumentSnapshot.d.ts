import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData";
export declare type QueryDocumentSnapshotClient<T = DocumentData> = client.QueryDocumentSnapshot<T>;
export declare type QueryDocumentSnapshotAdmin<T = DocumentData> = admin.QueryDocumentSnapshot<T>;
export declare type QueryDocumentSnapshot<T = DocumentData> = QueryDocumentSnapshotAdmin<T> | QueryDocumentSnapshotClient<T>;
