import type { FieldValue as FieldValueAdmin } from "firebase-admin/firestore";
import { FieldValue as FieldValueClient } from "firebase/firestore";
export type { FieldValueClient };
export type { FieldValueAdmin };
export type FieldValue = FieldValueClient | FieldValueAdmin;
export declare namespace FieldValue {
    function isInstance(obj: any): obj is FieldValue;
    function isClient(value: any): value is FieldValueClient;
    function isAdmin(value: any): value is FieldValueAdmin;
}
