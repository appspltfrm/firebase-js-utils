import { getDocFromServer, getDocsFromServer } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export async function getDataFromServer(docOrQuery, options) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return (await getDocsFromServer(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return (await getDocFromServer(docOrQuery)).data(options);
        }
        else {
            return (await docOrQuery.get()).data();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getDataFromServer.js.map