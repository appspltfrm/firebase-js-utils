import type {firestore as admin} from "firebase-admin";
import type * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";

export type QuerySnapshotClient<T extends DocumentData = any> = client.QuerySnapshot<T>;
export type QuerySnapshotAdmin<T extends DocumentData = any> = admin.QuerySnapshot<T>;
export type QuerySnapshot<T extends DocumentData = any> = QuerySnapshotAdmin<T> | QuerySnapshotClient<T>;
