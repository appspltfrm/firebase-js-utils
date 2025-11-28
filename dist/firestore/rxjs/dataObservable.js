import { map } from "rxjs";
import { DocumentReference } from "../DocumentReference.js";
import { Query } from "../Query.js";
import { SnapshotOptions } from "../SnapshotOptions.js";
import { snapshotObservable } from "./snapshotObservable.js";
export function dataObservable(docOrQuery, options) {
    if (Query.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, options)
            .pipe(map(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions.extract(options)))));
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, options)
            .pipe(map(snapshot => snapshot.data()));
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=dataObservable.js.map