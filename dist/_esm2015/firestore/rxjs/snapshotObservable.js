import { Observable } from "rxjs";
import { DocumentReference } from "../DocumentReference";
import { onSnapshot } from "firebase/firestore";
import { Query } from "../Query";
export function snapshotObservable(docOrQuery, options) {
    if (!(Query.isInstance(docOrQuery) || DocumentReference.isInstance(docOrQuery))) {
        throw new Error("Invalid DocumentReference or Query object");
    }
    return new Observable(subscriber => {
        if (Query.isInstance(docOrQuery)) {
            if (Query.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, options !== null && options !== void 0 ? options : {}, snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
            else {
                const unsubscribe = docOrQuery.onSnapshot(snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
        }
        else if (DocumentReference.isInstance(docOrQuery)) {
            if (DocumentReference.isClient(docOrQuery)) {
                const unsubscribe = onSnapshot(docOrQuery, options !== null && options !== void 0 ? options : {}, snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
            else if (DocumentReference.isAdmin(docOrQuery)) {
                const unsubscribe = docOrQuery.onSnapshot(snapshot => subscriber.next(snapshot), error => subscriber.error(error));
                return () => unsubscribe();
            }
        }
    });
}
//# sourceMappingURL=snapshotObservable.js.map