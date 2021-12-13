import type {firestore as admin} from "firebase-admin";
import {FieldValue as FieldValueClient} from "firebase/firestore";

export type {FieldValueClient};
export type FieldValueAdmin = admin.FieldValue;
export type FieldValue = FieldValueClient | FieldValueAdmin;
