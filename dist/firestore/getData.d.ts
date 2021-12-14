import { DocumentData } from "./DocumentData";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export declare function getData<T = DocumentData>(docOrQuery: DocumentReference<T>): Promise<T>;
export declare function getData<T = DocumentData>(docOrQuery: Query<T>): Promise<T[]>;
