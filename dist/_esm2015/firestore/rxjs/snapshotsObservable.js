import { map } from "rxjs";
import { snapshotObservable } from "./snapshotObservable";
export function snapshotsObservable(query, options) {
    return snapshotObservable(query, options)
        .pipe(map(snapshot => snapshot.docs));
}
//# sourceMappingURL=snapshotsObservable.js.map