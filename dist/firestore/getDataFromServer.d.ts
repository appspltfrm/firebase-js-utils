import type { SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
import { DocumentReference } from "./DocumentReference.js";
import { Query } from "./Query.js";
import { RestQuery } from "./RestQuery.js";
export declare function getDataFromServer<T extends DocumentData = any>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
export declare function getDataFromServer<T extends DocumentData = any>(query: Query<T> | RestQuery<T>, options?: SnapshotOptions): Promise<T[]>;
