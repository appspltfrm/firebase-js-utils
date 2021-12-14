import { __awaiter } from "tslib";
import { getSnapshotFromServer } from "./getSnapshotFromServer";
export function getSnapshotsFromServer(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getSnapshotFromServer(query)).docs;
    });
}
//# sourceMappingURL=getSnapshotsFromServer.js.map