import type {Precondition, WriteResult} from "@google-cloud/firestore";
import {updateDoc} from "firebase/firestore";
import {DocumentData} from "./DocumentData";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";

export function updateDocument<T = DocumentData>(doc: DocumentReference<T>, data: Partial<T>): Promise<any>;

export function updateDocument<T = DocumentData>(doc: DocumentReferenceClient<T>, data: Partial<T>): Promise<void>;

export function updateDocument<T = DocumentData>(doc: DocumentReferenceAdmin<T>, data: Partial<T>, precondition?: Precondition): Promise<WriteResult>;

export function updateDocument<T = DocumentData>(doc: DocumentReference<T>, data: Partial<T>, precondition?: any): Promise<any> {

    if (DocumentReference.isClient(doc)) {
        return updateDoc(doc, data as any);
    } else {
        return doc.update(data as any, precondition);
    }

}
