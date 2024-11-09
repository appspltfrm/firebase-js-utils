import { getDoc, getDocs } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export async function getData(docOrQuery, options) {
    if (Query.isInstance(docOrQuery)) {
        if (Query.isClient(docOrQuery)) {
            return (await getDocs(docOrQuery)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (await docOrQuery.get()).docs.map(snapshot => snapshot.data());
        }
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        if (DocumentReference.isClient(docOrQuery)) {
            return (await getDoc(docOrQuery)).data(options);
        }
        else {
            return (await docOrQuery.get()).data();
        }
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=getData.js.map