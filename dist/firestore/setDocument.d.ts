import type { WriteResult, SetOptions as SetOptionsAdmin } from "@google-cloud/firestore";
import { SetOptions as SetOptionsClient } from "firebase/firestore";
import { DocumentData } from "./DocumentData";
import { DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient } from "./DocumentReference";
type SetOptions = SetOptionsClient | SetOptionsAdmin;
export declare function setDocument<T = DocumentData>(doc: DocumentReference<T>, data: Partial<T>, options?: SetOptions): Promise<any>;
export declare function setDocument<T = DocumentData>(doc: DocumentReferenceClient<T>, data: Partial<T>, options?: SetOptionsClient): Promise<void>;
export declare function setDocument<T = DocumentData>(doc: DocumentReferenceAdmin<T>, data: Partial<T>, options?: SetOptionsAdmin): Promise<WriteResult>;
export {};
