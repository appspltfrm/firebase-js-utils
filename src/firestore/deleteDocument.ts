import type {Precondition, WriteResult} from "@google-cloud/firestore";
import {deleteDoc as deleteDocClient} from "firebase/firestore";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";

export function deleteDocument(doc: DocumentReference): Promise<any>;

export function deleteDocument(doc: DocumentReferenceClient): Promise<void>;

export function deleteDocument(doc: DocumentReferenceAdmin, precondition?: Precondition): Promise<WriteResult>;

export function deleteDocument(doc: DocumentReference, precondition?: any): Promise<any> {

    if (DocumentReference.isClient(doc)) {
        return deleteDocClient(doc);
    } else {
        return doc.delete(precondition);
    }

}
