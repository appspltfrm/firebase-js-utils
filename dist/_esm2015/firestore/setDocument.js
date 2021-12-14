import { setDoc } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
export function setDocument(doc, data, options) {
    if (DocumentReference.isClient(doc)) {
        return setDoc(doc, data, options);
    }
    else {
        return doc.set(data, options);
    }
}
//# sourceMappingURL=setDocument.js.map