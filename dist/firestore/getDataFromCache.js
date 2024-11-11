import { getDocFromCache, getDocsFromCache } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference.js";
import { Query } from "./Query.js";
export async function getDataFromCache(docOrQuery, options) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return (await getDocsFromCache(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return (await getDocFromCache(docOrQuery)).data(options);
        }
        else {
            return (await docOrQuery.get()).data();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getDataFromCache.js.map