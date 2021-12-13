import { DocumentData } from "./DocumentData";
import { DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference";
import { DocumentSnapshotAdmin, DocumentSnapshotClient } from "./DocumentSnapshot";
export declare function getDocSnapshot<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;
export declare function getDocSnapshot<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;
export declare function getDocSnapshotFromCache<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;
export declare function getDocSnapshotFromCache<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;
export declare function getDocSnapshotFromServer<T = DocumentData>(doc: DocumentReferenceClient<T>): Promise<DocumentSnapshotClient<T>>;
export declare function getDocSnapshotFromServer<T = DocumentData>(doc: DocumentReferenceAdmin<T>): Promise<DocumentSnapshotAdmin<T>>;
