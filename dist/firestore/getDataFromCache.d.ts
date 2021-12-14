import type { SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export declare function getDataFromCache<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
export declare function getDataFromCache<T = DocumentData>(query: Query<T>, options?: SnapshotOptions): Promise<T[]>;
