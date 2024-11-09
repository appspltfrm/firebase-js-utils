import { getDocFromCache, getDocsFromCache } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export async function getSnapshotFromCache(docOrQuery) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return await getDocsFromCache(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return await getDocFromCache(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getSnapshotFromCache.js.map