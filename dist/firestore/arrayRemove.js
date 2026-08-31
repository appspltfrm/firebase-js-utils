import { arrayRemove as arrayRemoveClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export function arrayRemove(...elements) {
    if (Firestore.adminInitialized()) {
        return Firestore.admin().FieldValue.arrayRemove(...elements);
    }
    else {
        return arrayRemoveClient(...elements);
    }
}
//# sourceMappingURL=arrayRemove.js.map