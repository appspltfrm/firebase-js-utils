import { map, skipWhile } from "rxjs";
import { DocumentReference } from "../DocumentReference.js";
import { Query } from "../Query.js";
import { SnapshotOptions } from "../SnapshotOptions.js";
import { snapshotObservable } from "./snapshotObservable.js";
export function dataObservable(docOrQuery, options) {
    const snapshotListenOptions = { includeMetadataChanges: !!options?.skipCache, skipErrors: options?.skipErrors };
    if (Query.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, snapshotListenOptions)
            .pipe(skipWhile(snapshot => !!options?.skipCache && Query.isClient(docOrQuery) && !!snapshot.metadata.fromCache && !!snapshot.docs.find(d => d.metadata.fromCache)), map(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions.extract(options)))));
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, snapshotListenOptions)
            .pipe(skipWhile(snapshot => !!options?.skipCache && DocumentReference.isClient(docOrQuery) && !!snapshot.metadata.fromCache), map(snapshot => snapshot.data()));
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=dataObservable.js.map