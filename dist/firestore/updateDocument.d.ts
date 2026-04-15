import type { Precondition, WriteResult } from "firebase-admin/firestore";
import { DocumentData } from "./DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference.js";
export declare function updateDocument<T extends DocumentData = any>(doc: DocumentReference<T>, data: Partial<T>): Promise<any>;
export declare function updateDocument<T extends DocumentData = any>(doc: DocumentReferenceClient<T>, data: Partial<T>): Promise<void>;
export declare function updateDocument<T extends DocumentData = any>(doc: DocumentReferenceAdmin<T>, data: Partial<T>, precondition?: Precondition): Promise<WriteResult>;
