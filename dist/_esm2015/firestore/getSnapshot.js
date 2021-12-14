import { __awaiter } from "tslib";
import { getDoc, getDocs } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export function getSnapshot(docOrQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isInstance(docOrQuery)) {
            if (Query.isClient(docOrQuery)) {
                return yield getDocs(docOrQuery);
            }
            else {
                return yield docOrQuery.get();
            }
        }
        else if (DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference.isClient(docOrQuery)) {
                return yield getDoc(docOrQuery);
            }
            else {
                return yield docOrQuery.get();
            }
        }
        else {
            throw new Error("Invalid DocumentReference or Query object");
        }
    });
}
//# sourceMappingURL=getSnapshot.js.map