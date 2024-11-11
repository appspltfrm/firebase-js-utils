import { deleteDoc as deleteDocClient } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference.js";
export function deleteDocument(doc, precondition) {
    if (DocumentReference.isClient(doc)) {
        return deleteDocClient(doc);
    }
    else {
        return doc.delete(precondition);
    }
}
//# sourceMappingURL=deleteDocument.js.map