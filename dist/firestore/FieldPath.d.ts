import type { firestore as admin } from "firebase-admin";
import { FieldPath as $FieldPathClient } from "firebase/firestore";
export type FieldPathClient = $FieldPathClient;
export type FieldPathAdmin = admin.FieldPath;
export type FieldPath = FieldPathClient | FieldPathAdmin;
export declare namespace FieldPath {
    function isInstance(obj: any): obj is FieldPath;
    function isClient(value: any): value is FieldPathClient;
    function isAdmin(value: any): value is FieldPathAdmin;
    function create(...fieldNames: string[]): FieldPath;
}
