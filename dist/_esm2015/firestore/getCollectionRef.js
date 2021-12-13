import { collection } from "firebase/firestore";
import { Firestore } from "./Firestore";
export function getCollectionRef(firestore, path) {
    if (Firestore.isClient(firestore)) {
        return collection(firestore, path);
    }
    else {
        return firestore.collection(path);
    }
}
//# sourceMappingURL=getCollectionRef.js.map