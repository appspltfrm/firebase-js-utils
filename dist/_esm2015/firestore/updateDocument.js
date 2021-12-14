import { updateDoc } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
export function updateDocument(doc, data, precondition) {
    if (DocumentReference.isClient(doc)) {
        return updateDoc(doc, data);
    }
    else {
        return doc.update(data, precondition);
    }
}
//# sourceMappingURL=updateDocument.js.map