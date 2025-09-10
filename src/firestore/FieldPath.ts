import type {firestore as admin} from "firebase-admin";
import {FieldPath as $FieldPathClient} from "firebase/firestore";
import {Firestore} from "./Firestore.js";

export type FieldPathClient = $FieldPathClient;
export type FieldPathAdmin = admin.FieldPath;
export type FieldPath = FieldPathClient | FieldPathAdmin;

export namespace FieldPath {

    export function isInstance(obj: any): obj is FieldPath {
        return obj instanceof $FieldPathClient || (Firestore.adminInitialized() && obj instanceof Firestore.admin().FieldPath);
    }

    export function isClient(value: any): value is FieldPathClient {
        return value instanceof $FieldPathClient;
    }

    export function isAdmin(value: any): value is FieldPathAdmin {
        return !isClient(value) && (Firestore.adminInitialized() && value instanceof Firestore.admin().FieldPath);
    }

    export function create(...fieldNames: string[]): FieldPath {
        if (Firestore.adminInitialized()) {
            return new (Firestore.admin().FieldPath)(...fieldNames);
        } else {
            return new $FieldPathClient(...fieldNames);
        }
    }

}
