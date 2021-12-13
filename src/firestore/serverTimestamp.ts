import {serverTimestamp as serverTimestampClient} from "firebase/firestore";
import {FieldValue, FieldValueClient} from "./FieldValue";
import {Firestore, FirestoreAdmin, FirestoreClient} from "./Firestore";

export function serverTimestamp(firestore: FirestoreClient): FieldValueClient;

export function serverTimestamp(firestore: FirestoreAdmin): FieldValue;

export function serverTimestamp(firestore: Firestore): FieldValue;

export function serverTimestamp(firestore: Firestore): FieldValue {

    if (Firestore.isClient(firestore)) {
        return serverTimestampClient();
    } else {
        Firestore.admin().FieldValue.serverTimestamp();
    }

}
