"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataObservable = dataObservable;
const rxjs_1 = require("rxjs");
const DocumentReference_1 = require("../DocumentReference");
const Query_1 = require("../Query");
const SnapshotOptions_1 = require("../SnapshotOptions");
const snapshotObservable_1 = require("./snapshotObservable");
function dataObservable(docOrQuery, options) {
    const snapshotListenOptions = { includeMetadataChanges: !!options?.skipCache, skipErrors: options?.skipErrors };
    if (Query_1.Query.isInstance(docOrQuery)) {
        return (0, snapshotObservable_1.snapshotObservable)(docOrQuery, snapshotListenOptions)
            .pipe((0, rxjs_1.skipWhile)(snapshot => !!options?.skipCache && Query_1.Query.isClient(docOrQuery) && !!snapshot.metadata.fromCache && !!snapshot.docs.find(d => d.metadata.fromCache)), (0, rxjs_1.map)(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions_1.SnapshotOptions.extract(options)))));
    }
    else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
        return (0, snapshotObservable_1.snapshotObservable)(docOrQuery, snapshotListenOptions)
            .pipe((0, rxjs_1.skipWhile)(snapshot => !!options?.skipCache && DocumentReference_1.DocumentReference.isClient(docOrQuery) && !!snapshot.metadata.fromCache), (0, rxjs_1.map)(snapshot => snapshot.data()));
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=dataObservable.js.map