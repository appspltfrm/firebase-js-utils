"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotObservable = snapshotObservable;
const firestore_1 = require("firebase/firestore");
const rxjs_1 = require("rxjs");
const DocumentReference_1 = require("../DocumentReference");
const Query_1 = require("../Query");
function snapshotObservable(docOrQuery, options) {
    if (!(Query_1.Query.isInstance(docOrQuery) || DocumentReference_1.DocumentReference.isInstance(docOrQuery))) {
        throw new Error("Invalid DocumentReference or Query object");
    }
    return new rxjs_1.Observable(subscriber => {
        let hasValue = false;
        const handleNext = (snapshot) => {
            hasValue = true;
            subscriber.next(snapshot);
        };
        const handleError = (error) => {
            // console.debug("snapshot error", hasValue ? "skip" : "throw", docOrQuery);
            if (options?.skipErrors !== false && hasValue) {
                console.warn(error);
            }
            else {
                subscriber.error(error);
            }
        };
        if (Query_1.Query.isInstance(docOrQuery)) {
            if (Query_1.Query.isClient(docOrQuery)) {
                const unsubscribe = (0, firestore_1.onSnapshot)(docOrQuery, extractSnapshotListen(options), handleNext, handleError);
                return () => unsubscribe();
            }
            else {
                const unsubscribe = docOrQuery.onSnapshot(handleNext, handleError);
                return () => unsubscribe();
            }
        }
        else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
                const unsubscribe = (0, firestore_1.onSnapshot)(docOrQuery, extractSnapshotListen(options), handleNext, handleError);
                return () => unsubscribe();
            }
            else if (DocumentReference_1.DocumentReference.isAdmin(docOrQuery)) {
                const unsubscribe = docOrQuery.onSnapshot(handleNext, handleError);
                return () => unsubscribe();
            }
        }
    });
}
function extractSnapshotListen(options) {
    if (!options) {
        return {};
    }
    return Object.assign({}, "includeMetadataChanges" in options ? { "includeMetadataChanges": options.includeMetadataChanges } : undefined);
}
//# sourceMappingURL=snapshotObservable.js.map