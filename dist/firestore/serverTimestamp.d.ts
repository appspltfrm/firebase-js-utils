import { FieldValue, FieldValueClient } from "./FieldValue";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export declare function serverTimestamp(firestore: FirestoreClient): FieldValueClient;
export declare function serverTimestamp(firestore: FirestoreAdmin): FieldValue;
export declare function serverTimestamp(firestore: Firestore): FieldValue;
