import { deleteDoc as deleteDocClient } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
export function deleteDoc(doc, precondition) {
    if (DocumentReference.isClient(doc)) {
        return deleteDocClient(doc);
    }
    else {
        return doc.delete(precondition);
    }
}
//# sourceMappingURL=deleteDoc.js.map