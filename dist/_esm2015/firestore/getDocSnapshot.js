import { __awaiter } from "tslib";
import { getDoc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
export function getDocSnapshot(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return yield getDoc(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
export function getDocSnapshotFromCache(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return yield getDocFromCache(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
export function getDocSnapshotFromServer(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (DocumentReference.isClient(doc)) {
            return yield getDocFromServer(doc);
        }
        else {
            return yield doc.get();
        }
    });
}
//# sourceMappingURL=getDocSnapshot.js.map