import { __awaiter } from "tslib";
import { getSnapshotFromCache } from "./getSnapshotFromCache";
export function getSnapshotsFromCache(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getSnapshotFromCache(query)).docs;
    });
}
//# sourceMappingURL=getSnapshotsFromCache.js.map