import type {QueryDocumentSnapshot as QueryDocumentSnapshotAdmin} from "firebase-admin/firestore";
import type {QueryDocumentSnapshot as QueryDocumentSnapshotClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";

export type {QueryDocumentSnapshotClient};
export type {QueryDocumentSnapshotAdmin};
export type QueryDocumentSnapshot<T extends DocumentData = any> = QueryDocumentSnapshotAdmin<T> | QueryDocumentSnapshotClient<T>;
