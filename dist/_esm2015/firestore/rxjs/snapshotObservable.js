import { Observable } from "rxjs";
import { DocumentReference } from "../DocumentReference";
import { onSnapshot } from "firebase/firestore";
import { Query } from "../Query";
export function snapshotObservable(docOrQuery, options) {
    if (!(Query.isInstance(docOrQuery) || DocumentReference.isInstance(docOrQuery))) {
        throw new Error("Invalid DocumentReference or Query object");
    }
    return new Observable(subscriber => {
        let hasValue = false;
        const handleNext = (snapshot) => {
            hasValue = true;
            subscriber.next(snapshot);
        };
        const handleError = (error) => {
            if ((options === null || options === void 0 ? void 0 : options.skipErrors) && hasValue) {
                console.warn(error);
            }
            else {
                subscriber.error(error);
            }
        };
        if (Query.isInstance(docOrQuery)) {
            if (Query.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, extractSnapshotListen(options), handleNext, handleError);
                return () => unsubscribe();
            }
            else {
                const unsubscribe = docOrQuery.onSnapshot(handleNext, handleError);
                return () => unsubscribe();
            }
        }
        else if (DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, extractSnapshotListen(options), handleNext, handleError);
                return () => unsubscribe();
            }
            else if (DocumentReference.isAdmin(docOrQuery)) {
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