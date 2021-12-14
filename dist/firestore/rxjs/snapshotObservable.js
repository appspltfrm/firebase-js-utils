"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotObservable = void 0;
const rxjs_1 = require("rxjs");
const DocumentReference_1 = require("../DocumentReference");
const firestore_1 = require("firebase/firestore");
const Query_1 = require("../Query");
function snapshotObservable(docOrQuery, options) {
    if (!(Query_1.Query.isInstance(docOrQuery) || DocumentReference_1.DocumentReference.isInstance(docOrQuery))) {
        throw new Error("Invalid DocumentReference or Query object");
    }
    return new rxjs_1.Observable(subscriber => {
        if (Query_1.Query.isInstance(docOrQuery)) {
            if (Query_1.Query.isClient(docOrQuery)) {
                const unsubscribe = (0, firestore_1.onSnapshot)(docOrQuery, options, snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
            else {
                const unsubscribe = docOrQuery.onSnapshot(snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
        }
        else if (DocumentReference_1.DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference_1.DocumentReference.isClient(docOrQuery)) {
                const unsubscribe = (0, firestore_1.onSnapshot)(docOrQuery, options, snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
            else if (DocumentReference_1.DocumentReference.isAdmin(docOrQuery)) {
                const unsubscribe = docOrQuery.onSnapshot(snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
        }
    });
}
exports.snapshotObservable = snapshotObservable;
//# sourceMappingURL=snapshotObservable.js.map