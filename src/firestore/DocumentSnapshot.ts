import type {firestore as admin} from "firebase-admin";
import type * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";

export type DocumentSnapshotClient<T = DocumentData> = client.DocumentSnapshot<T>;
export type DocumentSnapshotAdmin<T = DocumentData> = admin.DocumentSnapshot<T>;
export type DocumentSnapshot<T = DocumentData> = DocumentSnapshotAdmin<T> | DocumentSnapshotClient<T>;
