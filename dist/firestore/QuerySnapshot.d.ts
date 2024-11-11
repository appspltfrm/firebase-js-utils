import type { firestore as admin } from "firebase-admin";
import type * as client from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
export type QuerySnapshotClient<T = DocumentData> = client.QuerySnapshot<T>;
export type QuerySnapshotAdmin<T = DocumentData> = admin.QuerySnapshot<T>;
export type QuerySnapshot<T = DocumentData> = QuerySnapshotAdmin<T> | QuerySnapshotClient<T>;
