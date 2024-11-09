import { getDocFromServer, getDocsFromServer } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export async function getSnapshotFromServer(docOrQuery) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return await getDocsFromServer(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return await getDocFromServer(docOrQuery);
        }
        else {
            return await docOrQuery.get();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getSnapshotFromServer.js.map