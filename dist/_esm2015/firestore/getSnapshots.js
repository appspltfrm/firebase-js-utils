import { __awaiter } from "tslib";
import { getSnapshot } from "./getSnapshot";
export function getSnapshots(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield getSnapshot(query)).docs;
    });
}
//# sourceMappingURL=getSnapshots.js.map