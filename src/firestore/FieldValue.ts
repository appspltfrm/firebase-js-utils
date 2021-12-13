import type {firestore as admin} from "firebase-admin";
import {FieldValue as $FieldValueClient} from "firebase/firestore";
import {Firestore} from "./Firestore";

export type FieldValueClient = $FieldValueClient;
export type FieldValueAdmin = admin.FieldValue;
export type FieldValue = FieldValueClient | FieldValueAdmin;

export namespace FieldValue {

    export function isInstance(obj: any): obj is FieldValue {
        return obj instanceof $FieldValueClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().FieldValue);
    }

    export function isClient(value: any): value is FieldValueClient {
        return value instanceof $FieldValueClient;
    }

    export function isAdmin(value: any): value is FieldValueAdmin {
        return !isClient(value) && (Firestore.adminInitialized() && value instanceof Firestore.admin().FieldValue);
    }

}
