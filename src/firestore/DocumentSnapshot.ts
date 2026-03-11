import type {firestore as admin} from "firebase-admin";
import type * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";

export type DocumentSnapshotClient<T extends DocumentData = any> = client.DocumentSnapshot<T>;
export type DocumentSnapshotAdmin<T extends DocumentData = any> = admin.DocumentSnapshot<T>;
export type DocumentSnapshot<T extends DocumentData = any> = DocumentSnapshotAdmin<T> | DocumentSnapshotClient<T>;
