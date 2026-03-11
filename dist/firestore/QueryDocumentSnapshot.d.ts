import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
export type QueryDocumentSnapshotClient<T extends DocumentData = any> = client.QueryDocumentSnapshot<T>;
export type QueryDocumentSnapshotAdmin<T extends DocumentData = any> = admin.QueryDocumentSnapshot<T>;
export type QueryDocumentSnapshot<T extends DocumentData = any> = QueryDocumentSnapshotAdmin<T> | QueryDocumentSnapshotClient<T>;
