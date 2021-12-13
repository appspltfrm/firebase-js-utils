import { __awaiter } from "tslib";
import { getDoc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
export function getDocData(doc, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return (yield getDoc(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
export function getDocDataFromCache(doc, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return (yield getDocFromCache(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
export function getDocDataFromServer(doc, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return (yield getDocFromServer(doc)).data(options);
        }
        else {
            return (yield doc.get()).data();
        }
    });
}
//# sourceMappingURL=getDocData.js.map