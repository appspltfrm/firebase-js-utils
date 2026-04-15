import type { Precondition, WriteResult } from "firebase-admin/firestore";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference.js";
export declare function deleteDocument(doc: DocumentReference): Promise<any>;
export declare function deleteDocument(doc: DocumentReferenceClient): Promise<void>;
export declare function deleteDocument(doc: DocumentReferenceAdmin, precondition?: Precondition): Promise<WriteResult>;
