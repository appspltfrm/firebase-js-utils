import type { Precondition, WriteResult } from "@google-cloud/firestore";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference";
export declare function deleteDoc(doc: DocumentReference): Promise<any>;
export declare function deleteDoc(doc: DocumentReferenceClient): Promise<void>;
export declare function deleteDoc(doc: DocumentReferenceAdmin, precondition?: Precondition): Promise<WriteResult>;
