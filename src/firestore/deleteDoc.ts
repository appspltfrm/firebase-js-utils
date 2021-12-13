import type {Precondition, WriteResult} from "@google-cloud/firestore";
import {deleteDoc as deleteDocClient} from "firebase/firestore";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference";

export function deleteDoc(doc: DocumentReference): Promise<any>;

export function deleteDoc(doc: DocumentReferenceClient): Promise<void>;

export function deleteDoc(doc: DocumentReferenceAdmin, precondition?: Precondition): Promise<WriteResult>;

export function deleteDoc(doc: DocumentReference, precondition?: any): Promise<any> {

    if (DocumentReference.isClient(doc)) {
        return deleteDocClient(doc);
    } else {
        return doc.delete(precondition);
    }

}
