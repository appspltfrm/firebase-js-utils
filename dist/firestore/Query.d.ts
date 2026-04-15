import type { Query as QueryAdmin } from "firebase-admin/firestore";
import { Query as QueryClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData.js";
export type { QueryClient };
export type { QueryAdmin };
/**
 * Polimorficzne zapytanie Firestore, ujednolicające Web SDK i Admin SDK.
 */
export type Query<T extends DocumentData = any> = QueryAdmin<T> | QueryClient<T>;
export declare namespace Query {
    /**
       * Sprawdza, czy obiekt jest instancją zapytania Firestore (klienta lub admina).
       */
    function isInstance<T extends DocumentData = any>(obj: any): obj is Query<T>;
    /**
       * Sprawdza, czy zapytanie pochodzi z Web SDK.
       */
    function isClient<T extends DocumentData = any>(query: Query<T>): query is QueryClient<T>;
    /**
       * Sprawdza, czy zapytanie pochodzi z Admin SDK.
       */
    function isAdmin<T extends DocumentData = any>(query: Query<T>): query is QueryAdmin<T>;
}
