import { DocumentData } from "./DocumentData.js";
import { DocumentReference } from "./DocumentReference.js";
import { Query } from "./Query.js";
export declare function getData<T = DocumentData>(docOrQuery: DocumentReference<T>): Promise<T>;
export declare function getData<T = DocumentData>(docOrQuery: Query<T>): Promise<T[]>;
