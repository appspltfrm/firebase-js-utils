"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataObservable = void 0;
const rxjs_1 = require("rxjs");
const DocumentReference_1 = require("../DocumentReference");
const Query_1 = require("../Query");
const SnapshotListenOptions_1 = require("../SnapshotListenOptions");
const SnapshotOptions_1 = require("../SnapshotOptions");
const snapshotObservable_1 = require("./snapshotObservable");
function dataObservable(docOrQuery, options) {
    if (Query_1.Query.isInstance(docOrQuery)) {
        return (0, snapshotObservable_1.snapshotObservable)(docOrQuery, SnapshotListenOptions_1.SnapshotListenOptions.extract(options))
            .pipe((0, rxjs_1.map)(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions_1.SnapshotOptions.extract(options)))));
    }
    else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
        return (0, snapshotObservable_1.snapshotObservable)(docOrQuery, SnapshotListenOptions_1.SnapshotListenOptions.extract(options))
            .pipe((0, rxjs_1.map)(snapshot => snapshot.data()));
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
exports.dataObservable = dataObservable;
//# sourceMappingURL=dataObservable.js.map