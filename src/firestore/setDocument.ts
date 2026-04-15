import type {WriteResult, SetOptions as SetOptionsAdmin} from "firebase-admin/firestore";
import {setDoc, SetOptions as SetOptionsClient} from "firebase/firestore";
import {DocumentData} from "./DocumentData.js";
import {DocumentReference, DocumentReferenceAdmin, DocumentReferenceClient} from "./DocumentReference.js";

type SetOptions = SetOptionsClient | SetOptionsAdmin;

export function setDocument<T extends DocumentData = any>(doc: DocumentReference<T>, data: Partial<T>, options?: SetOptions): Promise<any>;

export function setDocument<T extends DocumentData = any>(doc: DocumentReferenceClient<T>, data: Partial<T>, options?: SetOptionsClient): Promise<void>;

export function setDocument<T extends DocumentData = any>(doc: DocumentReferenceAdmin<T>, data: Partial<T>, options?: SetOptionsAdmin): Promise<WriteResult>;

export function setDocument<T extends DocumentData = any>(doc: DocumentReference<T>, data: Partial<T>, options?: SetOptions): Promise<any> {

  if (DocumentReference.isClient(doc)) {
    return setDoc(doc, data, options ?? {});
  } else {
    return doc.set(data, options ?? {});
  }

}
