import {firestore as admin} from "firebase-admin";
import * as client from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";
import {Firestore} from "./Firestore";

export type QueryClient<T = DocumentData> = client.Query<T>;
export type QueryAdmin<T = DocumentData> = admin.Query<T>;
export type Query<T = DocumentData> = QueryAdmin<T> | QueryClient<T>;

export namespace Query {

    export function isClient<T>(query: Query<T>): query is QueryClient<T> {
        return Firestore.isClient(query.firestore);
    }

    export function isAdmin<T>(query: Query<T>): query is QueryAdmin<T> {
        return !isClient(query);
    }
}
