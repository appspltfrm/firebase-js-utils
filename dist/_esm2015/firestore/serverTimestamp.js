import { serverTimestamp as serverTimestampClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export function serverTimestamp(firestore) {
    if (Firestore.isClient(firestore)) {
        return serverTimestampClient();
    }
    else {
        Firestore.admin().FieldValue.serverTimestamp();
    }
}
//# sourceMappingURL=serverTimestamp.js.map