import type {firestore as admin} from "firebase-admin";
import {Query as $QueryClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {Firestore} from "./Firestore.js";

export type QueryClient<T extends DocumentData = any> = $QueryClient<T>;
export type QueryAdmin<T extends DocumentData = any> = admin.Query<T>;

/**
 * Polimorficzne zapytanie Firestore, ujednolicające Web SDK i Admin SDK.
 */
export type Query<T extends DocumentData = any> = QueryAdmin<T> | QueryClient<T>;

export namespace Query {

  /**
     * Sprawdza, czy obiekt jest instancją zapytania Firestore (klienta lub admina).
     */
  export function isInstance<T extends DocumentData = any>(obj: any): obj is Query<T> {
    return obj instanceof $QueryClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().Query);
  }

  /**
     * Sprawdza, czy zapytanie pochodzi z Web SDK.
     */
  export function isClient<T extends DocumentData = any>(query: Query<T>): query is QueryClient<T> {
    return Firestore.isClient(query.firestore);
  }

  /**
     * Sprawdza, czy zapytanie pochodzi z Admin SDK.
     */
  export function isAdmin<T extends DocumentData = any>(query: Query<T>): query is QueryAdmin<T> {
    return !isClient(query);
  }
}
