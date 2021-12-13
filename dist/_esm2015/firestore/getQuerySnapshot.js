import { __awaiter } from "tslib";
import { getDocs, getDocsFromCache, getDocsFromServer } from "firebase/firestore";
import { Query } from "./Query";
export function getQuerySnapshot(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return yield getDocs(query);
        }
        else {
            return yield query.get();
        }
    });
}
export function getQuerySnapshotFromCache(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return yield getDocsFromCache(query);
        }
        else {
            return yield query.get();
        }
    });
}
export function getQuerySnapshotFromServer(query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return yield getDocsFromServer(query);
        }
        else {
            return yield query.get();
        }
    });
}
//# sourceMappingURL=getQuerySnapshot.js.map