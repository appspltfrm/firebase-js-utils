import type { Precondition, WriteResult } from "@google-cloud/firestore";
import { DocumentData } from "./DocumentData.js";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference.js";
export declare function updateDocument<T = DocumentData>(doc: DocumentReference<T>, data: Partial<T>): Promise<any>;
export declare function updateDocument<T = DocumentData>(doc: DocumentReferenceClient<T>, data: Partial<T>): Promise<void>;
export declare function updateDocument<T = DocumentData>(doc: DocumentReferenceAdmin<T>, data: Partial<T>, precondition?: Precondition): Promise<WriteResult>;
