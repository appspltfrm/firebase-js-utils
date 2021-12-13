import { __awaiter } from "tslib";
import { getDocs, getDocsFromCache, getDocsFromServer } from "firebase/firestore";
import { Query } from "./Query";
export function getQueryData(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return (yield getDocs(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
export function getQueryDataFromCache(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return (yield getDocsFromCache(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
export function getQueryDataFromServer(query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Query.isClient(query)) {
            return (yield getDocsFromServer(query)).docs.map(snapshot => snapshot.data(options));
        }
        else {
            return (yield query.get()).docs.map(snapshot => snapshot.data());
        }
    });
}
//# sourceMappingURL=getQueryData.js.map