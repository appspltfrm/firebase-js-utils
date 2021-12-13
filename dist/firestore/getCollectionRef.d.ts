import { CollectionReference, CollectionReferenceAdmin, CollectionReferenceClient } from "./CollectionReference";
import { DocumentData } from "./DocumentData";
import { Firestore, FirestoreAdmin, FirestoreClient } from "./Firestore";
export declare function getCollectionRef<T = DocumentData>(firestore: FirestoreClient, path: string): CollectionReferenceClient<T>;
export declare function getCollectionRef<T = DocumentData>(firestore: FirestoreAdmin, path: string): CollectionReferenceAdmin<T>;
export declare function getCollectionRef<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T>;
