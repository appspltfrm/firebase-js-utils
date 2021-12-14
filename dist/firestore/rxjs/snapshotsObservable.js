"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotsObservable = void 0;
const rxjs_1 = require("rxjs");
const snapshotObservable_1 = require("./snapshotObservable");
function snapshotsObservable(query, options) {
    return (0, snapshotObservable_1.snapshotObservable)(query, options)
        .pipe((0, rxjs_1.map)(snapshot => snapshot.docs));
}
exports.snapshotsObservable = snapshotsObservable;
//# sourceMappingURL=snapshotsObservable.js.map