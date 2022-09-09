import {serverTimestamp as serverTimestampClient} from "firebase/firestore";
import {FieldValue} from "./FieldValue";
import {Firestore} from "./Firestore";

export function serverTimestamp(): FieldValue {

    if (Firestore.adminInitialized()) {
        return Firestore.admin().FieldValue.serverTimestamp();
    } else {
        return serverTimestampClient();
    }

}
