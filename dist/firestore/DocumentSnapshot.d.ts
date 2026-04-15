import type { DocumentSnapshot as DocumentSnapshotAdmin } from "firebase-admin/firestore";
import type { DocumentSnapshot as DocumentSnapshotClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
export type { DocumentSnapshotClient };
export type { DocumentSnapshotAdmin };
export type DocumentSnapshot<T extends DocumentData = any> = DocumentSnapshotAdmin<T> | DocumentSnapshotClient<T>;
