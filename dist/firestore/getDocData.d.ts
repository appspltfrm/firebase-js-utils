import type { SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { DocumentReference } from "./DocumentReference";
export declare function getDocData<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
export declare function getDocDataFromCache<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
export declare function getDocDataFromServer<T = DocumentData>(doc: DocumentReference<T>, options?: SnapshotOptions): Promise<T>;
