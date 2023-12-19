import { map, skipWhile } from "rxjs";
import { DocumentReference } from "../DocumentReference";
import { Query } from "../Query";
import { SnapshotListenOptions } from "../SnapshotListenOptions";
import { SnapshotOptions } from "../SnapshotOptions";
import { snapshotObservable } from "./snapshotObservable";
export function dataObservable(docOrQuery, options) {
    if (Query.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, SnapshotListenOptions.extract(options))
            .pipe(skipWhile(snapshot => !!(options === null || options === void 0 ? void 0 : options.skipCache) && Query.isClient(docOrQuery) && !!snapshot.docs.find(d => d.metadata.fromCache)), map(snapshot => snapshot.docs.map(d => d.data(SnapshotOptions.extract(options)))));
    }
    else if (DocumentReference.isInstance(docOrQuery)) {
        return snapshotObservable(docOrQuery, SnapshotListenOptions.extract(options))
            .pipe(skipWhile(snapshot => !!(options === null || options === void 0 ? void 0 : options.skipCache) && DocumentReference.isClient(docOrQuery) && !!snapshot.metadata.fromCache), map(snapshot => snapshot.data()));
    }
    else {
        throw new Error("Invalid DocumentReference or Query object");
    }
}
//# sourceMappingURL=dataObservable.js.map