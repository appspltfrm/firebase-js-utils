import type { firestore as admin } from "firebase-admin";
import { FieldValue as $FieldValueClient } from "firebase/firestore";
export declare type FieldValueClient = $FieldValueClient;
export declare type FieldValueAdmin = admin.FieldValue;
export declare type FieldValue = FieldValueClient | FieldValueAdmin;
export declare namespace FieldValue {
    function isInstance(obj: any): obj is FieldValue;
    function isClient(value: any): value is FieldValueClient;
    function isAdmin(value: any): value is FieldValueAdmin;
}
