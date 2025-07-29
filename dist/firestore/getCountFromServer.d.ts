import { DocumentData } from "./DocumentData.js";
import { Query } from "./Query.js";
export declare function getCountFromServer<T = DocumentData>(query: Query<T>): Promise<number>;
