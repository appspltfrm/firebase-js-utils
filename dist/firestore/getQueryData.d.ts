import type { SnapshotOptions } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { QueryAdmin, QueryClient } from "./Query";
export declare function getQueryData<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;
export declare function getQueryData<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;
export declare function getQueryDataFromCache<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;
export declare function getQueryDataFromCache<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;
export declare function getQueryDataFromServer<T = DocumentData>(query: QueryClient<T>, options?: SnapshotOptions): Promise<T[]>;
export declare function getQueryDataFromServer<T = DocumentData>(query: QueryAdmin<T>, options?: SnapshotOptions): Promise<T[]>;
