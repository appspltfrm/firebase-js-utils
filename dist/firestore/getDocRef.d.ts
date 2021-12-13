import { DocumentData } from "./DocumentData";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export declare function getDocRef<T = DocumentData>(firestore: FirestoreClient, path: string): DocumentReferenceClient<T>;
export declare function getDocRef<T = DocumentData>(firestore: FirestoreAdmin, path: string): DocumentReferenceAdmin<T>;
export declare function getDocRef<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T>;
