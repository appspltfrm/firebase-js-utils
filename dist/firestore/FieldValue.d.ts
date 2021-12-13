import type { firestore as admin } from "firebase-admin";
import { FieldValue as FieldValueClient } from "firebase/firestore";
export type { FieldValueClient };
export declare type FieldValueAdmin = admin.FieldValue;
export declare type FieldValue = FieldValueClient | FieldValueAdmin;
