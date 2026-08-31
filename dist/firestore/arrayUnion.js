import { arrayUnion as arrayUnionClient } from "firebase/firestore";
import { Firestore } from "./Firestore.js";
export function arrayUnion(...elements) {
    if (Firestore.adminInitialized()) {
        return Firestore.admin().FieldValue.arrayUnion(...elements);
    }
    else {
        return arrayUnionClient(...elements);
    }
}
//# sourceMappingURL=arrayUnion.js.map