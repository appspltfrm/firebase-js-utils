import type {FieldValue as FieldValueAdmin} from "firebase-admin/firestore";
import {FieldValue as FieldValueClient} from "firebase/firestore";
import {Firestore} from "./Firestore.js";

export type {FieldValueClient};
export type {FieldValueAdmin};
export type FieldValue = FieldValueClient | FieldValueAdmin;

export namespace FieldValue {

  export function isInstance(obj: any): obj is FieldValue {
    return obj instanceof FieldValueClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().FieldValue);
  }

  export function isClient(value: any): value is FieldValueClient {
    return value instanceof FieldValueClient;
  }

  export function isAdmin(value: any): value is FieldValueAdmin {
    return !isClient(value) && (Firestore.adminInitialized() && value instanceof Firestore.admin().FieldValue);
  }

}
