import type { firestore as admin } from "firebase-admin";
import { Query as $QueryClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
export type QueryClient<T = DocumentData> = $QueryClient<T>;
export type QueryAdmin<T = DocumentData> = admin.Query<T>;
export type Query<T = DocumentData> = QueryAdmin<T> | QueryClient<T>;
export declare namespace Query {
    function isInstance<T>(obj: any): obj is Query<T>;
    function isClient<T>(query: Query<T>): query is QueryClient<T>;
    function isAdmin<T>(query: Query<T>): query is QueryAdmin<T>;
}
