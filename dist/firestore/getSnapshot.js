import { getDoc, getDocs } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export async function getSnapshot(docOrQuery) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return await getDocs(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return await getDoc(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getSnapshot.js.map