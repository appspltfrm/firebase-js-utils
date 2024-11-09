"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotsObservable = snapshotsObservable;
const rxjs_1 = require("rxjs");
const snapshotObservable_1 = require("./snapshotObservable");
function snapshotsObservable(query, options) {
    return (0, snapshotObservable_1.snapshotObservable)(query, options)
        .pipe((0, rxjs_1.map)(snapshot => snapshot.docs));
}
//# sourceMappingURL=snapshotsObservable.js.map