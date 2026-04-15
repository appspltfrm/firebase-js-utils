import type {QuerySnapshot as QuerySnapshotAdmin} from "firebase-admin/firestore";
import type {QuerySnapshot as QuerySnapshotClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";

export type {QuerySnapshotClient};
export type {QuerySnapshotAdmin};
export type QuerySnapshot<T extends DocumentData = any> = QuerySnapshotAdmin<T> | QuerySnapshotClient<T>;
