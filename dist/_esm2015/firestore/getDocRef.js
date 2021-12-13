import { doc } from "firebase/firestore";
import { Firestore } from "./Firestore";
export function getDocRef(firestore, path) {
    if (Firestore.isClient(firestore)) {
        return doc(firestore, path);
    }
    else {
        return firestore.doc(path);
    }
}
//# sourceMappingURL=getDocRef.js.map