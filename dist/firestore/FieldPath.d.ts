import type { FieldPath as FieldPathAdmin } from "firebase-admin/firestore";
import { FieldPath as FieldPathClient } from "firebase/firestore";
export type { FieldPathClient };
export type { FieldPathAdmin };
export type FieldPath = FieldPathClient | FieldPathAdmin;
export declare namespace FieldPath {
    function isInstance(obj: any): obj is FieldPath;
    function isClient(value: any): value is FieldPathClient;
    function isAdmin(value: any): value is FieldPathAdmin;
    function create(...fieldNames: string[]): FieldPath;
}
