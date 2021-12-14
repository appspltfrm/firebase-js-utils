import { __awaiter } from "tslib";
import { getDocFromCache, getDocsFromCache } from "firebase/firestore";
import { DocumentReference } from "./DocumentReference";
import { Query } from "./Query";
export function getDataFromCache(docOrQuery, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isInstance(docOrQuery)) {
            if (Query.isClient(docOrQuery)) {
                return (yield getDocsFromCache(docOrQuery)).docs.map(snapshot => snapshot.data(options));
            }
            else {
                return (yield docOrQuery.get()).docs.map(snapshot => snapshot.data());
            }
        }
        else if (DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference.isClient(docOrQuery)) {
                return (yield getDocFromCache(docOrQuery)).data(options);
            }
            else {
                return (yield docOrQuery.get()).data();
            }
        }
        else {
            throw new Error("Invalid DocumentReference or Query object");
        }
    });
}
//# sourceMappingURL=getDataFromCache.js.map