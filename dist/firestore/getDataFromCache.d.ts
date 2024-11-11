import type { SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { DocumentReference } from "./DocumentReference.js";
import { Query } from "./Query.js";
export declare function getDataFromCache<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
export declare function getDataFromCache<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]>;
