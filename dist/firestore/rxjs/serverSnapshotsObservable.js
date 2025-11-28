import { snapshotsObservable } from "./snapshotsObservable";
export function serverSnapshotsObservable(query, options) {
    return snapshotsObservable(query, Object.assign({ skipCache: true }, options));
}
//# sourceMappingURL=serverSnapshotsObservable.js.map