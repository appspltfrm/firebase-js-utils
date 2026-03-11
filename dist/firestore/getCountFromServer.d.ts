import { DocumentData } from "./DocumentData.js";
import { Query } from "./Query.js";
import { RestQuery } from "./RestQuery.js";
export declare function getCountFromServer<T extends DocumentData = any>(query: Query<T> | RestQuery<T>): Promise<number>;
