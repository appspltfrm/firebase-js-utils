import {serverTimestamp as serverTimestampClient} from "firebase/firestore";
import {FieldValue} from "./FieldValue.js";
import {Firestore} from "./Firestore.js";

export function serverTimestamp(): FieldValue {

    if (Firestore.adminInitialized()) {
        return Firestore.admin().FieldValue.serverTimestamp();
    } else {
        return serverTimestampClient();
    }

}
