import { serverTimestamp as serverTimestampClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export function serverTimestamp() {
    if (Firestore.adminInitialized()) {
        return Firestore.admin().FieldValue.serverTimestamp();
    }
    else {
        return serverTimestampClient();
    }
}
//# sourceMappingURL=serverTimestamp.js.map