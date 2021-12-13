import { runTransaction as runTransactionClient } from "firebase/firestore";
import { Firestore } from "./Firestore";
export function runTransaction(firestore, updateFunction) {
    if (Firestore.isClient(firestore)) {
        return runTransactionClient(firestore, updateFunction);
    }
    else {
        return firestore.runTransaction(updateFunction);
    }
}
//# sourceMappingURL=runTransaction.js.map