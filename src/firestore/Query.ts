import type {firestore as admin} from "firebase-admin";
import {Query as $QueryClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore} from "./Firestore.js";

export type QueryClient<T = DocumentData> = $QueryClient<T>;
export type QueryAdmin<T = DocumentData> = admin.Query<T>;
export type Query<T = DocumentData> = QueryAdmin<T> | QueryClient<T>;

export namespace Query {

    export function isInstance<T>(obj: any): obj is Query<T> {
        return obj instanceof $QueryClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Query);
    }

    export function isClient<T>(query: Query<T>): query is QueryClient<T> {
        return Firestore.isClient(query.firestore);
    }

    export function isAdmin<T>(query: Query<T>): query is QueryAdmin<T> {
        return !isClient(query);
    }
}
